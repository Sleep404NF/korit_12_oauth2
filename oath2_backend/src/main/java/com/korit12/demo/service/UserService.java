package com.korit12.demo.service;

import com.korit12.demo.dto.AuthResponseDto;
import com.korit12.demo.dto.LoginRequestDto;
import com.korit12.demo.dto.SignupRequestDto;
import com.korit12.demo.entity.User;
import com.korit12.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Transactional
    public AuthResponseDto signUp(SignupRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 email 입니다.");
        }
        // 비밀먼호는 input창을 통해서 string으로 넘어왔으니 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        User user = User.createLocalUser(dto.getEmail(), encodedPassword, dto.getName()); // 혹은 Builder패턴 도입 가능

        // User field 자체에는 token이 없고 ResponseDto에서 붙여서 보냄.
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponseDto.of(token,user.getEmail(), user.getName(), user.getRole().name());
    }

    public AuthResponseDto Login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new IllegalArgumentException("email 혹은 비밀번호가 틀렸습니다."));

        // OAuth2 적용인지 판단
        if (user.getPassword() == null) {
            throw new IllegalArgumentException("소셜 로그인 계정입니다. 구글/네이버/카카오 로그인을 이용해주세요");
        }

        // Bcrypt로 비밀번호 검증
        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())) { // if(dto.getPassword() == user.getPassword()
            throw new IllegalArgumentException("email 또는 비밀번호가 틀렸습니다.");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponseDto.of(token,user.getEmail(), user.getName(), user.getRole().name());
    }
}
