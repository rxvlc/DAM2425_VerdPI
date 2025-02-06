package backStudX.model;

import org.springframework.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

	@Id
	private String id;
	private String name;
	private String email;
	private String hashPasswd;
	private int role;
	
	

	public User(String name, String email, String hashPasswd, int role) {
		this.name = name;
		this.email = email;
		this.hashPasswd = hashPasswd;
		this.role = role;
	}
	
	public String getId() {
		return id;
	}



	public void setId(String id) {
		this.id = id;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getHashPasswd() {
		return hashPasswd;
	}



	public void setHashPasswd(String hashPasswd) {
		this.hashPasswd = hashPasswd;
	}



	public int getRole() {
		return role;
	}



	public void setRole(int role) {
		this.role = role;
	}

	
	
}
