package com.uomrecruit.utility.mapper;

import com.uomrecruit.dtos.StudentGetDto;
import com.uomrecruit.dtos.StudentPostDto;
import com.uomrecruit.models.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudentMapper {
    private final PasswordEncoder passwordEncoder;

    public StudentGetDto mapStudentEntityToDto(Student student) {
        return StudentGetDto.builder()
                .id(student.getId())
                .email(student.getEmail())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .preferredName(student.getPreferredName())
                .pronouns(student.getPronouns())
                .studentNumber(student.getStudentNumber())
                .isPublic(student.getIsPublic())
                .wwcc(student.getWwcc())
                .course(student.getCourse())
                .courseProgression(student.getCourseProgression())
                .currentLocation(student.getCurrentLocation())
                .locationOption(student.getLocationOption())
                .learningAreas(student.getLearningAreas())
                .otherSkillExperience(student.getOtherSkillExperience())
                .available(student.getAvailable())
                .image(student.getImage())
                .work_with_children(student.getWork_with_children())
                .build();
    }

    public Student mapStudentDtoToEntity(StudentPostDto studentPostDto)
    {
        String encodePassword = passwordEncoder.encode(studentPostDto.getPassword());
        return Student.builder()
                .email(studentPostDto.getEmail())
                .password(encodePassword)
                .firstName(studentPostDto.getFirstName())
                .lastName(studentPostDto.getLastName())
                .preferredName(studentPostDto.getPreferredName())
                .pronouns(studentPostDto.getPronouns())
                .studentNumber(studentPostDto.getStudentNumber())
                .isPublic(studentPostDto.getIsPublic())
                .wwcc(studentPostDto.getWwcc())
                .course(studentPostDto.getCourse())
                .courseProgression(studentPostDto.getCourseProgression())
                .currentLocation(studentPostDto.getCurrentLocation())
                .locationOption(studentPostDto.getLocationOption())
                .learningAreas(studentPostDto.getLearningAreas())
                .otherSkillExperience(studentPostDto.getOtherSkillExperience())
                .available(studentPostDto.getAvailable())
                .image(studentPostDto.getImage())
                .work_with_children(studentPostDto.getWork_with_children())
                .build();
    }
}
