package backStudX.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import backStudX.model.Token;

public interface TokenRepository extends MongoRepository<Token, String> {

	@Query(value = "{'emailUser' : ?0, 'token' : ?1 }")
	List<Token> findUserTokens(String emailUser, String token);

	
}
