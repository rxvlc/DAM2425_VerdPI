package backStudX.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.management.Notification;

import org.apache.catalina.connector.Response;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import backStudX.Services.ExchangeService;
import backStudX.model.Exchange;
import backStudX.model.Token;
import backStudX.model.User;
import backStudX.model.Notifications;

import backStudX.repository.ExchangeRepository;
import backStudX.repository.NotificationsRepository;
import backStudX.repository.TokenRepository;
import backStudX.repository.UserRepository;

@RestController
public class Controller {

	@Autowired
	UserRepository userRepository;

	@Autowired
	TokenRepository tokenRepository;

	@Autowired
	ExchangeRepository exchangeRepository;
	
	@Autowired
	NotificationsRepository notificationRepository;

	@Autowired
	private ExchangeService exchangeService;

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
	public ResponseEntity<String> forgotPassword(@RequestBody String userMail) {
		String content = "";
		try {
			// Accedemos al archivo pw.json desde el classpath
			InputStream inputStream = getClass().getClassLoader().getResourceAsStream("pw.json");

			if (inputStream == null) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body("No se encontró el archivo de credenciales.");
			}

			// Leemos el contenido del archivo
			content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		if (!content.isEmpty()) {
			JSONObject mailCredentials = new JSONObject(content);
			String email = mailCredentials.getString("mail");
			String password = mailCredentials.getString("psw");

			if (!userMail.isEmpty()) {
				SendEmail.sendMail(email, password, userMail);
				return ResponseEntity.status(HttpStatus.OK).build();
			}
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

	}

	@PostMapping("/api/auth/reset-password")
	ResponseEntity<String> resetPassword() {

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}

	@PostMapping("/api/exchanges")
	ResponseEntity<String> createExchange(@RequestBody String exchange) {

		try {
			JSONObject objectExchange = new JSONObject(exchange);

			String token = objectExchange.getString("token");
			Token t = tokenRepository.findToken(token);
			if (t != null && !t.isExpired()) {
				String nativeLanguage = objectExchange.getString("nativeLanguage");
				String targetLanguage = objectExchange.getString("targetLanguage");
				String educationalLevel = objectExchange.getString("educationalLevel");
				int academicLevel = objectExchange.getInt("academicLevel");
				String idTeacherCreator = objectExchange.getString("idTeacherCreator");

				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
				LocalDate beginDate = LocalDate.parse(objectExchange.getString("beginDate"), formatter);
				LocalDate endDate = LocalDate.parse(objectExchange.getString("endDate"), formatter);

				Date beginDateMongo = Date.from(beginDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
				Date endDateMongo = Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

				int quantityStudents = objectExchange.getInt("quantityStudents");
				String university = objectExchange.getString("university");

				// Crear el objeto Exchange
				Exchange newExchange = new Exchange(nativeLanguage, targetLanguage, educationalLevel, academicLevel,
						idTeacherCreator, beginDateMongo, endDateMongo, quantityStudents, university);

				exchangeRepository.save(newExchange);

				return ResponseEntity.status(HttpStatus.CREATED).build();
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}

		} catch (Exception e) {
			// Manejo de excepciones
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Error al procesar la solicitud: " + e.getMessage());
		}
	}

	@RequestMapping("/api/exchanges")
	public ResponseEntity<List<Exchange>> getExchanges(@RequestParam(required = false) String nativeLanguage,
			@RequestParam(required = false) String targetLanguage,
			@RequestParam(required = false) String educationalLevel,
			@RequestParam(required = false) Integer academicLevel,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date beginDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
			@RequestParam(required = false) Integer quantityStudentsMin,
			@RequestParam(required = false) Integer quantityStudentsMax,
			@RequestParam(required = false) String university) {

		List<Exchange> exchanges = exchangeService.searchExchanges(nativeLanguage, targetLanguage, educationalLevel,
				academicLevel, beginDate, endDate, quantityStudentsMin, quantityStudentsMax, university);

		return ResponseEntity.ok(exchanges);
	}

	@RequestMapping("/api/exchanges/")
	public ResponseEntity<Optional<Exchange>> getExchangeById(@RequestParam(required = true) String exchangeId) {

		return ResponseEntity.ok().body(exchangeRepository.findById(exchangeId));
	}
	
	@PostMapping("/api/notifications")
	ResponseEntity<String> createNotification(@RequestBody String notification){
		JSONObject newNotification = new JSONObject(notification);
		
		String token = newNotification.getString("token");
		Token t = tokenRepository.findToken(token);
		
		if (t != null && !t.isExpired()) {
			String message = (String) newNotification.getString("message");
			String recipient = (String) newNotification.getString("recipient");
			String notificatonType = (String) newNotification.getString("notificationType");
			
			User searchUser = userRepository.findUserMail(recipient);
			
			if(searchUser == null)
			{
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			} else {
				Notifications noti = new Notifications("hola", recipient, message, notificatonType, false);
				notificationRepository.save(noti);
				
				return ResponseEntity.status(HttpStatus.ACCEPTED).build();

			}
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}		
	}
	

}
