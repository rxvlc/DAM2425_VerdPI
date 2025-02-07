package backStudX.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userPreferences")
public class Preferences {

	@Id
	String id;
	boolean darkMode;
	boolean notifications;
	String language;
	
}
