package backStudX.model;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.http.converter.HttpMessageNotReadableException;

@Document(collection = "notifications")
public class Notifications {
	
	@Id
	String id;
	String idUserSender;
	String message;
	String typeMessage;
	boolean messageReaded;
	
	public Notifications(String idUserSender, String message, String typeMessage, boolean messageReaded) {
		this.idUserSender = idUserSender;
		this.message = message;
		this.typeMessage = typeMessage;
		this.messageReaded = messageReaded;
	}
	
	
	// Change property to readed message or not readed.
	public void ChangeToReadedMessage(){
		messageReaded = true;
	}
	
	public void ChangeToNotReadedMessage() {
		messageReaded = false;
	}


	//  Getters & Setters

	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getIdUserSender() {
		return idUserSender;
	}


	public void setIdUserSender(String idUserSender) {
		this.idUserSender = idUserSender;
	}


	public String getMessage() {
		return message;
	}


	public void setMessage(String message) {
		this.message = message;
	}


	public String getTypeMessage() {
		return typeMessage;
	}


	public void setTypeMessage(String typeMessage) {
		this.typeMessage = typeMessage;
	}


	public boolean isMessageReaded() {
		return messageReaded;
	}


	public void setMessageReaded(boolean messageReaded) {
		this.messageReaded = messageReaded;
	}
	
	
	
	
	
	
}
