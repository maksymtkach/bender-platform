package org.example.backend.service;

import lombok.AllArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository repository;
    public User saveUser(User user) {
        return repository.save(user);
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public boolean existsByUsername(String username) {
        return repository.findByUsername(username).isPresent();
    }
    public boolean existsByEmail(String email) {
        return repository.findByEmail(email).isPresent();
    }

    public User findByUsername(String username) {
        return repository.findByUsername(username).orElse(null);
    }

    public User findByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }
}
