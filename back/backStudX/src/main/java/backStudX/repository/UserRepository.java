package backStudX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import backStudX.model.User;

public interface UserRepository extends MongoRepository<User, String> {

	@Query(value = "{ 'username' : ?0 }")
	List<User> buscarUsuariNomUsuari(String nom);

}
	