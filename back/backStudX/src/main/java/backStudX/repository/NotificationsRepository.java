package backStudX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import backStudX.model.Notifications;


public interface NotificationsRepository extends MongoRepository<Notifications, String> {

	@Query(value = "{'idUserSender' : ?0")
	List<Notifications> findUserSender(String idUserSender);
}
