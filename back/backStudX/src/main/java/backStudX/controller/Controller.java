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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import backStudX.SendEmail;

import backStudX.Util;
import backStudX.Services.ExchangeService;
import backStudX.model.Exchange;
import backStudX.model.Group;
import backStudX.model.Token;
import backStudX.model.User;
import backStudX.model.Notifications;

import backStudX.repository.ExchangeRepository;
import backStudX.repository.GroupRepository;
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
	GroupRepository groupRepository;

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
	
	@PostMapping("/api/auth/loginWithToken")
	ResponseEntity<String> loginWithToken(@RequestBody String userData) {
		JSONObject newUserObject = new JSONObject(userData);

		String emailUser = (String) newUserObject.get("email");
		String token = (String) newUserObject.get("token");

		Token t = tokenRepository.findToken(token);
		if(t != null && t.getUserId().equals(emailUser) && !t.isExpired()) {
			return ResponseEntity.status(HttpStatus.OK).build();
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

				String idTeacherCreator = t.getUserId();

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
			} else {
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
	

	@PutMapping("/api/exchanges/")
	public ResponseEntity<?> updateExchange(@RequestParam String id, @RequestBody String exchangeJson) {

		try {
			JSONObject objectExchange = new JSONObject(exchangeJson);

			String token = objectExchange.getString("token");
			Token t = tokenRepository.findToken(token);

			if (t == null || t.isExpired()) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado.");
			}

			Optional<Exchange> optionalExchange = exchangeRepository.findById(id);
			if (optionalExchange.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exchange no encontrado.");
			}

			Exchange existingExchange = optionalExchange.get();

			// Actualizar solo los campos proporcionados en la petición
			if (objectExchange.has("nativeLanguage")) {
				existingExchange.setNativeLanguage(objectExchange.getString("nativeLanguage"));
			}
			if (objectExchange.has("targetLanguage")) {
				existingExchange.setTargetLanguage(objectExchange.getString("targetLanguage"));
			}
			if (objectExchange.has("educationalLevel")) {
				existingExchange.setEducationalLevel(objectExchange.getString("educationalLevel"));
			}
			if (objectExchange.has("academicLevel")) {
				existingExchange.setAcademicLevel(objectExchange.getInt("academicLevel"));
			}
			if (objectExchange.has("beginDate")) {
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
				LocalDate beginDate = LocalDate.parse(objectExchange.getString("beginDate"), formatter);
				existingExchange.setBeginDate(Date.from(beginDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
			}
			if (objectExchange.has("endDate")) {
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
				LocalDate endDate = LocalDate.parse(objectExchange.getString("endDate"), formatter);
				existingExchange.setEndDate(Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
			}
			if (objectExchange.has("quantityStudents")) {
				existingExchange.setQuantityStudents(objectExchange.getInt("quantityStudents"));
			}
			if (objectExchange.has("university")) {
				existingExchange.setUniversity(objectExchange.getString("university"));
			}

			// Guardar cambios en MongoDB
			exchangeRepository.save(existingExchange);

			return ResponseEntity.ok(existingExchange);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Error al actualizar el intercambio: " + e.getMessage());
		}
	}

	@DeleteMapping("/api/exchanges/")
	public ResponseEntity<?> deleteExchange(@RequestParam String id, @RequestParam("token") String token) {
		try {
			// Verificar que el token es válido
			Token t = tokenRepository.findToken(token);
			if (t != null && !t.isExpired()) {
				// Buscar el exchange por su id
				Optional<Exchange> exchangeOptional = exchangeRepository.findById(id);
				if (exchangeOptional.isPresent()) {
					Exchange exchange = exchangeOptional.get();

					// Eliminar el exchange
					exchangeRepository.delete(exchange);

					// Responder con confirmación de eliminación
					return ResponseEntity.status(HttpStatus.OK).body("Exchange successfully deleted");
				} else {
					// Si no se encuentra el exchange con ese id
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exchange not found");
				}
			} else {
				// Si el token no es válido o ha expirado
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
			}
		} catch (Exception e) {
			// Manejo de errores
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
		}
	}
	
	
	@PostMapping("/api/groups")
	public ResponseEntity<String> createGroup(@RequestBody String group) {

	    try {
	        JSONObject objectGroup = new JSONObject(group);

	        String token = objectGroup.getString("token");
	        Token t = tokenRepository.findToken(token);
	        if (t != null && !t.isExpired()) {
	            // Obtener los datos de la solicitud
	            String name = objectGroup.getString("name");
	            int languajeLevel = objectGroup.getInt("languajeLevel");
	            int quantity = objectGroup.getInt("quantity");
	            String languaje = objectGroup.getString("languaje");

	            // Crear el objeto Group
	            Group newGroup = new Group(name, languajeLevel, quantity, languaje,t.getUserId());

	            // Guardar el objeto en el repositorio
	            groupRepository.save(newGroup);

	            // Responder con estado creado
	            return ResponseEntity.status(HttpStatus.CREATED).body("Group successfully created");
	        } else {
	            // Si el token es inválido o ha expirado
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
	        }

	    } catch (Exception e) {
	        // Manejo de excepciones
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Error al procesar la solicitud: " + e.getMessage());
	    }
	}
	
	@RequestMapping("/api/groups")
	public ResponseEntity<?> getGroupsWithIdOfTeacher(@RequestParam String token) {
	    // Buscar el token en la base de datos
	    Token t = tokenRepository.findToken(token);
	    
	    // Verificar si el token es válido y no ha expirado
	    if (t != null && !t.isExpired()) {
	        // Obtener los grupos asociados al ID del profesor
	        Optional<Group> groupOptional = groupRepository.getGroupByTeacherId(t.getUserId());
	        
	        // Si el grupo existe, retornamos el grupo encontrado
	        if (groupOptional.isPresent()) {
	            return ResponseEntity.status(HttpStatus.OK).body(groupOptional.get());
	        } else {
	            // Si no se encuentra el grupo, retornamos un mensaje de error
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found for teacher.");
	        }
	    } else {
	        // Si el token es inválido o ha expirado, retornamos un error
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
	    }
	}

	


}
