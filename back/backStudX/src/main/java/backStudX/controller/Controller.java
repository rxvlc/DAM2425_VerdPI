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
import org.springframework.web.multipart.MultipartFile;

import backStudX.SendEmail;

import backStudX.Util;
import backStudX.Services.CloudinaryService;
import backStudX.Services.ExchangeService;
import backStudX.model.Exchange;
import backStudX.model.Group;
import backStudX.model.Token;
import backStudX.model.User;
import backStudX.model.Notification;
import backStudX.model.Preferences;
import backStudX.repository.ExchangeRepository;
import backStudX.repository.GroupRepository;
import backStudX.repository.NotificationsRepository;
import backStudX.repository.PreferencesRepository;
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
	NotificationsRepository notificationsRepository;

	@Autowired
	GroupRepository groupRepository;

	@Autowired
	PreferencesRepository preferencesRepository;

	@Autowired
	private ExchangeService exchangeService;

	@Autowired
	private CloudinaryService cloudinaryService;

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
		if (t != null && t.getUserId().equals(emailUser) && !t.isExpired()) {
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
			userInJson.put("urlProfilePicture", u.getUrlProfilePicture());
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
				String academicLevel = objectExchange.getString("academicLevel");

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

	@GetMapping("/api/notifications")
	public ResponseEntity<List<Notification>> getUserNotifications(
			@RequestParam(value = "idUserRec") String idUserRecipient, @RequestParam(value = "token") String token) {
		// Validar el token
		Token t = tokenRepository.findToken(token);

		if (t == null || t.isExpired()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // El token es inválido o expirado
		}

		// Obtener las notificaciones del destinatario
		List<Notification> notifications = notificationsRepository.findUserRecipient(idUserRecipient);

		if (notifications.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // No hay notificaciones
		}

		// Devolver las notificaciones encontradas
		return ResponseEntity.ok(notifications);
	}

	@PutMapping("/api/notifications/read")
	public ResponseEntity<?> updateReadedNotification(@RequestParam String updatedInfo) {
		try {
			JSONObject readedMessage = new JSONObject(updatedInfo);

			String id = readedMessage.getString("id");
			String token = readedMessage.getString("token");
			Token t = tokenRepository.findToken(token);

			if (t == null || t.isExpired()) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado.");
			}

			Optional<Notification> notificationSearched = notificationsRepository.findById(id);
			Notification notificationSelected = notificationSearched.get();

			if (readedMessage.has("messageReaded")) {
				notificationSelected.setMessageReaded(true);
			}

			notificationsRepository.save(notificationSelected);
			return ResponseEntity.ok(notificationSelected);

		} catch (Exception e) {
			// TODO: handle exception
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Error al actualizar el intercambio: " + e.getMessage());
		}
	}
	
	@PutMapping("/api/notifications/{id}/read")
	public ResponseEntity<String> markNotificationAsRead(
	        @PathVariable("id") String notificationId, 
	        @RequestParam("token") String token) {

	    // Validar el token
	    Token t = tokenRepository.findToken(token);
	    if (t == null || t.isExpired()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Invalid or expired token.");
	    }

	    // Buscar la notificación por ID
	    Optional<Notification> notificationOpt = notificationsRepository.findById(notificationId);
	    if (!notificationOpt.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("Notification not found.");
	    }

	    // Obtener la notificación
	    Notification notification = notificationOpt.get();

	    // Marcar la notificación como leída
	    notification.setMessageReaded(true);

	    // Guardar la notificación actualizada
	    notificationsRepository.save(notification);

	    // Devolver respuesta exitosa
	    return ResponseEntity.ok("Notification marked as read.");
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
				existingExchange.setAcademicLevel(objectExchange.getString("academicLevel"));
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
				Group newGroup = new Group(name, languajeLevel, quantity, languaje, t.getUserId());

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

	@RequestMapping("/api/groups/")
	public ResponseEntity<?> getOneGroup(@RequestParam(required = true) String groupId, @RequestParam String token) {

		Token t = tokenRepository.findToken(token);
		if (t != null && !t.isExpired()) {
			return ResponseEntity.ok().body(groupRepository.findById(groupId));
		} else {
			return ResponseEntity.badRequest().build();
		}
	}

	@PutMapping("/api/groups/")
	public ResponseEntity<?> updateGroup(@RequestParam String id, @RequestBody String groupJson) {
		try {
			JSONObject objectGroup = new JSONObject(groupJson);

			Optional<Group> optionalGroup = groupRepository.findById(id);
			if (optionalGroup.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grupo no encontrado.");
			}

			Group existingGroup = optionalGroup.get();

			// Actualizar solo los campos proporcionados en la petición
			if (objectGroup.has("name")) {
				existingGroup.setName(objectGroup.getString("name"));
			}
			if (objectGroup.has("languajeLevel")) {
				existingGroup.setLanguajeLevel(objectGroup.getInt("languajeLevel"));
			}
			if (objectGroup.has("quantity")) {
				existingGroup.setQuantity(objectGroup.getInt("quantity"));
			}
			if (objectGroup.has("languaje")) {
				existingGroup.setLanguaje(objectGroup.getString("languaje"));
			}
			if (objectGroup.has("userId")) {
				existingGroup.setUserId(objectGroup.getString("userId"));
			}

			// Guardar cambios en MongoDB
			groupRepository.save(existingGroup);

			return ResponseEntity.ok(existingGroup);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Error al actualizar el grupo: " + e.getMessage());
		}
	}

	@DeleteMapping("/api/groups/")
	public ResponseEntity<?> deleteGroup(@RequestParam String id, @RequestParam("token") String token) {
		try {
			// Verificar que el token es válido
			Token t = tokenRepository.findToken(token);
			if (t == null || t.isExpired()) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
			}

			// Buscar el grupo por su id
			Optional<Group> groupOptional = groupRepository.findById(id);
			if (groupOptional.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
			}

			if (groupOptional.get().getUserId().equals(t.getUserId())) {
				// Eliminar el grupo
				groupRepository.delete(groupOptional.get());
				// Responder con confirmación de eliminación
				return ResponseEntity.status(HttpStatus.OK).body("Group successfully deleted");
			} else {

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Probably problem with token");
			}

		} catch (Exception e) {
			// Manejo de errores
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
		}
	}

	@PostMapping("/api/upload")
	public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			// Llamar al servicio de Cloudinary para cargar el archivo
			String fileUrl = cloudinaryService.uploadFile(file);
			return ResponseEntity.ok(fileUrl); // Retornar la URL del archivo cargado
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error uploading file");
		}
	}

	@PostMapping("/api/preferences")
	public ResponseEntity<String> createPreference(@RequestBody String preferenceJson) {
		try {
			JSONObject objectPref = new JSONObject(preferenceJson);

			String token = objectPref.getString("token");
			Token t = tokenRepository.findToken(token);

			if (t != null && !t.isExpired()) {
				// Obtener los datos de la solicitud
				String userId = t.getUserId();
				boolean darkMode = objectPref.getBoolean("darkMode");
				boolean notifications = objectPref.getBoolean("notifications");
				String language = objectPref.getString("language");

				// Crear el objeto Preferences
				Preferences newPreference = new Preferences(userId, darkMode, notifications, language);

				// Guardar en el repositorio
				preferencesRepository.save(newPreference);

				// Responder con estado 201 Created
				return ResponseEntity.status(HttpStatus.CREATED).body("Preference successfully created");
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
			}

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Error al procesar la solicitud: " + e.getMessage());
		}
	}

	// GET - Obtener preferencias del usuario
	@GetMapping("/api/users/me/preferences")
	public ResponseEntity<?> getUserPreferences(@RequestParam String token) {
		try {
			Token t = tokenRepository.findToken(token);

			if (t != null && !t.isExpired()) {
				Preferences preferences = preferencesRepository.findByUserId(t.getUserId());

				if (preferences != null) {
					return ResponseEntity.ok(preferences);
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Preferences not found for user.");
				}
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error retrieving preferences: " + e.getMessage());
		}
	}

	// PUT - Actualizar preferencias del usuario
	@PutMapping("/api/users/me/preferences")
	public ResponseEntity<String> updateUserPreferences(@RequestBody String preferencesJson) {
		try {
			JSONObject json = new JSONObject(preferencesJson);
			String token = json.getString("token");

			Token t = tokenRepository.findToken(token);
			if (t != null && !t.isExpired()) {
				Preferences preferences = preferencesRepository.findByUserId(t.getUserId());

				if (preferences != null) {
					// Actualizar preferencias con los nuevos valores
					preferences.setDarkMode(json.getBoolean("darkMode"));
					preferences.setNotifications(json.getBoolean("notifications"));
					preferences.setLanguage(json.getString("language"));

					preferencesRepository.save(preferences);
					return ResponseEntity.ok("Preferences updated successfully");
				} else {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Preferences not found for user.");
				}
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating preferences: " + e.getMessage());
		}
	}

	@PutMapping("/api/auth/update")
	public ResponseEntity<String> updateUser(@RequestBody String userData) {
	    try {
	        JSONObject updatedUserObject = new JSONObject(userData);

	        // Extraer y validar el token
	        String token = updatedUserObject.getString("token");
	        Token t = tokenRepository.findToken(token);

	        if (t == null || t.isExpired()) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado.");
	        }

	        // Obtener el usuario a partir del email asociado al token
	        String email = t.getEmail();
	        User existingUser = userRepository.findUserMail(email);

	        if (existingUser == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
	        }

	        // Actualizar solo los campos proporcionados
	        String name = updatedUserObject.optString("name", existingUser.getName());
	        String university = updatedUserObject.optString("university", existingUser.getUniversity());
	        String urlProfilePicture = updatedUserObject.optString("urlProfilePicture", existingUser.getUrlProfilePicture());

	        existingUser.setName(name);
	        existingUser.setUniversity(university);
	        existingUser.setUrlProfilePicture(urlProfilePicture);

	        // Guardar cambios en la base de datos
	        userRepository.save(existingUser);

	        return ResponseEntity.ok("Usuario actualizado correctamente");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Error al actualizar el usuario: " + e.getMessage());
	    }
	}


	
}
