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
	private String university;
	
	
	

	public User(String name, String email, String hashPasswd, String university) {
		this.name = name;
		this.email = email;
		this.hashPasswd = hashPasswd;
		this.university = university;
	}
	
	
	
	public String getUniversity() {
		return university;
	}



	public void setUniversity(String university) {
		this.university = university;
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



	

	
	
}
