package backStudX.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.apache.catalina.connector.Response;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import backStudX.SendEmail;

import backStudX.Util;
import backStudX.model.Token;
import backStudX.model.User;
import backStudX.repository.TokenRepository;
import backStudX.repository.UserRepository;

@RestController
public class Controller {

	@Autowired
	UserRepository userRepository;
	@Autowired
	TokenRepository tokenRepository;

	@PostMapping("/api/auth/register")
	ResponseEntity<String> registerUser(@RequestBody String userData) {
		JSONObject newUserObject = new JSONObject(userData);

		String emailNewUser = (String) newUserObject.get("email");
		User userWithSameMail = userRepository.findUserMail(emailNewUser);

		if (userWithSameMail != null) {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} else {
			String name = newUserObject.getString("name");
			String passwd = newUserObject.getString("password");
			String hashedPassword = Util.hashPassword(passwd);
			String university = newUserObject.getString("university");
			User newUser = new User(name, emailNewUser, hashedPassword, university);
			userRepository.save(newUser);
			return ResponseEntity.status(HttpStatus.ACCEPTED).build();
		}

	}

	@PostMapping("/api/auth/login")
	ResponseEntity<String> loginUser(@RequestBody String userData) {
		JSONObject newUserObject = new JSONObject(userData);

		String emailUser = (String) newUserObject.get("email");
		String passwordUser = (String) newUserObject.get("password");

		User u = userRepository.findUserMail(emailUser);

		if (u != null) {
			if (Util.verifyPassword(passwordUser, u.getHashPasswd())) {
				String token = UUID.randomUUID().toString();
				Token t = new Token(emailUser, token, Instant.now().plus(7, ChronoUnit.DAYS));
				tokenRepository.save(t);
				return ResponseEntity.status(HttpStatus.OK).body(token);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

	}

	@PostMapping("/api/auth/logout")
	ResponseEntity<String> logoutUser(@RequestBody String userData) {

		JSONObject newUserObject = new JSONObject(userData);
		String email = newUserObject.getString("email");
		String token = newUserObject.getString("token");
		Token t = tokenRepository.findToken(token);
		if (t == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		} else {
			tokenRepository.delete(t);

			return ResponseEntity.status(HttpStatus.OK).build();
		}

	}

	@RequestMapping("/api/users/me")
	ResponseEntity<String> me(@RequestParam(value = "token") String token) {

		Token t = tokenRepository.findToken(token);
		if (t != null) {
			User u = userRepository.findUserMail(t.getUserId());
			JSONObject userInJson = new JSONObject();
			userInJson.put("email", u.getEmail());
			userInJson.put("name", u.getName());
			userInJson.put("password", u.getHashPasswd());
			userInJson.put("university", u.getUniversity());
			return ResponseEntity.status(HttpStatus.OK).body(userInJson.toString());
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	@PostMapping("/api/auth/forgotPassword")
	ResponseEntity<String> forgotPassword(@RequestBody String userMail){
		File credentials = new File("./pw.json");
		String content = "";
        try {
			content = new String(Files.readAllBytes(credentials.toPath()));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        if(!content.equals("")) {
    		JSONObject mailCredentials = new JSONObject(content);
    		String email = mailCredentials.getString("mail");
    		String password = mailCredentials.getString("psw");
    		System.out.println(userMail);
    		if(!userMail.equals("")) {

        		SendEmail.sendMail(email, password, userMail);
        		return ResponseEntity.status(HttpStatus.OK).build();
    		}
        }
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}
	
	@PostMapping("/api/auth/reset-password")
	ResponseEntity<String> resetPassword(){
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}
	
	@PostMapping("/api/exchanges")
	ResponseEntity<String> createExchange(){

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

}
