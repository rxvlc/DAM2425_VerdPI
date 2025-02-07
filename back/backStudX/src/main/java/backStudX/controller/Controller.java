package backStudX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backStudX.model.User;
import backStudX.repository.UserRepository;

@RestController
public class Controller {

	@Autowired
	UserRepository userRepository;
	
	
	@RequestMapping("/api/auth/registera")
	String pacoa() {
		List<User> llista = userRepository.findUserMail("pepe") ;
//		return llista.get(0).getName();
		System.out.println(llista.get(0).getName());
		return "asd";
	}
	
	@PostMapping("/api/auth/registerUser")
	String registerUser() {
		List<User> list = userRepository.findUserMail(inputMail);
		String nameEmail = list.get(0).getEmail();
		
		if(inputMail == nameEmail) {
			return "200";
		} else {
			return "401";
		}

	}
	
}
