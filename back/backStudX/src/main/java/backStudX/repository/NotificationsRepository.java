package backStudX.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import backStudX.model.Notification;

@Repository
public interface NotificationsRepository extends MongoRepository<Notification, String> {

	@Query(value = "{'idUserSender' : ?0")
	List<Notification> findUserSender(String idUserSender);

	@Query("{ 'idUserRecipient' : ?0 }")
	List<Notification> findUserRecipient(String idUserRecipient);

	Optional<Notification> findById(String id);

}
