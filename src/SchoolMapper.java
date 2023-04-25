package com.uomrecruit.utility.mapper;

import com.uomrecruit.dtos.SchoolGetDto;
import com.uomrecruit.dtos.SchoolPostDto;
import com.uomrecruit.dtos.SchoolPutDto;
import com.uomrecruit.models.School;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class SchoolMapper {
    private final PasswordEncoder passwordEncoder;
    public SchoolGetDto mapSchoolEntityToDto(School school) {
        return SchoolGetDto.builder()
                .id(school.getId())
                .email(school.getEmail())
                .schoolName(school.getSchoolName())
                .contactName(school.getContactName())
                .contactEmail(school.getContactEmail())
                .webAddress(school.getWebAddress())
                .sector(school.getSector())
                .yearLevels(school.getYearLevels())
                .image(school.getImage())
                .setEnabled(school.isSetEnabled())

                .build();
    }

    public School mapSchoolDtoToEntity(SchoolPostDto schoolPostDto) {
        String encodedPassword = passwordEncoder.encode(schoolPostDto.getPassword());
        return School.builder()
                .password(encodedPassword)
                .email(schoolPostDto.getEmail())
                .schoolName(schoolPostDto.getSchoolName())
                .contactName(schoolPostDto.getContactName())
                .contactEmail(schoolPostDto.getContactEmail())
                .webAddress(schoolPostDto.getWebAddress())
                .sector(schoolPostDto.getSector())
                .yearLevels(schoolPostDto.getYearLevels())
                .image(schoolPostDto.getImage())
                .build();
    }

    public SchoolPutDto mapSchoolPostDtoToSchoolPutDto(SchoolPostDto schoolPostDto) {
        String encodedPassword = passwordEncoder.encode(schoolPostDto.getPassword());
        if (schoolPostDto == null) {
          return null;
        }
        return SchoolPutDto.builder()
            .password(encodedPassword)
            .schoolName(schoolPostDto.getSchoolName())
            .contactName(schoolPostDto.getContactName())
            .contactEmail(schoolPostDto.getContactEmail())
            .webAddress(schoolPostDto.getWebAddress())
            .sector(schoolPostDto.getSector())
            .yearLevels(schoolPostDto.getYearLevels())
            .image(schoolPostDto.getImage())
            .build();
    }
}
