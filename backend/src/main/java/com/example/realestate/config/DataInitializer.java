package com.example.realestate.config;

import com.example.realestate.repository.BookingRepository;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;

    @Override
    public void run(String... args) {
        logger.info("Real Estate System initialized. All demo accounts removed. Ready for live user registration.");
    }
}
