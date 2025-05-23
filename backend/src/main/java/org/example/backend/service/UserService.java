package org.example.backend.service;

import lombok.AllArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository repository;
    public void saveUser(User user) {
        repository.save(user);
    }
    public List<User> getAllUsers(String email) {
        return repository.findAll();
    }
    public boolean existsByUsername(String username) {
        return repository.findByUsername(username).isPresent();
    }
    public User findByUsername(String username) {
        return repository.findByUsername(username).orElse(null);
    }
}
