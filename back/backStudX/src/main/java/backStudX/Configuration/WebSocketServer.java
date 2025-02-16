package backStudX.Configuration;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import backStudX.model.Message;
import backStudX.repository.MessageRepository;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;

@jakarta.websocket.server.ServerEndpoint("/ws")
@Component
public class WebSocketServer {

	MessageRepository messageRepository;

	@jakarta.websocket.OnMessage
	public void onMessage(String message, Session session) {
		// Crear el mensaje en base a la estructura que tienes
		Message newMessage = new Message();
		newMessage.setMessage(message);
		newMessage.setIdUserSender("senderUserId"); // Debes obtener el ID del remitente
		newMessage.setIdUserRecipient("recipientUserId"); // Obtener el ID del receptor
		newMessage.setMessageReaded(false);
		newMessage.setCreatedAt(LocalDateTime.now());
		newMessage.setTypeMessage("text"); // Asumimos que es texto, pero puede ser diferente según el caso

		// Guardar el mensaje en la base de datos
		messageRepository.save(newMessage);

		// Enviar el mensaje al receptor
		sendMessageToRecipient(newMessage.getIdUserRecipient(), message);
	}

	private void sendMessageToRecipient(String recipientUserId, String message) {
		Session recipientSession = userSessions.get(recipientUserId);
		if (recipientSession != null) {
			try {
				// Enviar el mensaje al receptor
				recipientSession.getBasicRemote().sendText(message);
				System.out.println("Mensaje enviado a " + recipientUserId);
			} catch (IOException e) {
				System.out.println("Error al enviar mensaje WebSocket: " + e.getMessage());
			}
		} else {
			System.out.println("El usuario " + recipientUserId + " no está conectado.");
		}
	}

	private static final Map<String, Session> userSessions = new HashMap<>();

	public static Map<String, Session> getUserSessions() {
		return userSessions;
	}

	// Método para agregar una nueva sesión
	@OnOpen
	public void onOpen(Session session) {
		String userId = session.getRequestParameterMap().get("userId").get(0); // Supón que recibimos el ID del usuario
																				// al abrir la sesión
		userSessions.put(userId, session);
		System.out.println("Conexión abierta: " + session.getId() + " para el usuario: " + userId);
	}

	// Método para eliminar la sesión cuando se cierra la conexión
	@OnClose
	public void onClose(Session session) {
		userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
		System.out.println("Conexión cerrada: " + session.getId());
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		System.out.println("Error en WebSocket: " + throwable.getMessage());
	}
}
