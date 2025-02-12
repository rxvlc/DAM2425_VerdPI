package backStudX.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import backStudX.model.Notifications;


public interface NotificationsRepository extends MongoRepository<Notifications, String> {

	@Query(value = "{'idUserSender' : ?0")
	List<Notifications> findUserSender(String idUserSender);
	
	@Query(value = "{'idUserRecipient' : ?0")
	List<Notifications> findUserRecipient(String idUserRecipient);
	
	Optional<Notifications> findById(String id);
	
}
