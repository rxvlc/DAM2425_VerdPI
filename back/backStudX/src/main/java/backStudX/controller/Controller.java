package backStudX.controller;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

	@RequestMapping("/api/auth/registera")
	String pacoa() {
		List<User> llista = userRepository.findUserMail("pepe");
//		return llista.get(0).getName();
		System.out.println(llista.get(0).getName());
		return "asd";
	}

	@PostMapping("/api/auth/register")
	ResponseEntity<String> registerUser(@RequestBody String userData) {
		JSONObject newUserObject = new JSONObject(userData);

		String emailNewUser = (String) newUserObject.get("email");
		List<User> listUsersWithSameEmail = userRepository.findUserMail(emailNewUser);

		if (listUsersWithSameEmail.size() > 0) {

			System.out.println(listUsersWithSameEmail.get(0).getEmail());

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

		User u = userRepository.findUserMail(emailUser).get(0);

		if (u != null) {
			if (Util.verifyPassword(passwordUser, u.getHashPasswd())) {
				String token = UUID.randomUUID().toString();
				Token t = new Token(emailUser, token, Instant.now().plus(7, ChronoUnit.DAYS));
				tokenRepository.save(t);
				return ResponseEntity.status(HttpStatus.OK).body(token);
			}else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

	}

}
