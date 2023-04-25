package com.uomrecruit.repositories;

import com.uomrecruit.constants.school.Sector;
import com.uomrecruit.models.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;


import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface SchoolRepository extends JpaRepository<School, Long> {

    Optional<School> findByEmail(String email);
    Optional<School> findById(Long id);

    @Query("SELECT s.id FROM School s WHERE s.email = :email")
    Optional<Long> findIdByEmail(String email);

    @Modifying
    @Query("UPDATE School s SET s.schoolName = :schoolName, s.contactName = :contactName, s.contactEmail = :contactEmail, s.webAddress = :webAddress, s.sector = :sector, s.password = :password, s.yearLevels = :yearLevels, s.image = :image WHERE s.id = :id")
    int updateSchoolById(@Param("id") Long id, @Param("schoolName") String schoolName,
        @Param("contactName") String contactName, @Param("contactEmail") String contactEmail,
        @Param("webAddress") String webAddress, @Param("sector") Sector sector,
        @Param("yearLevels") String yearLevels, @Param("image") String image,
        @Param("password") String password);

    @Modifying
    @Query("UPDATE School s SET s.schoolName = :schoolName, s.contactName = :contactName, s.contactEmail = :contactEmail, s.webAddress = :webAddress, s.sector = :sector, s.yearLevels = :yearLevels, s.image = :image WHERE s.id = :id")
    int updateSchoolProfileById(@Param("id") Long id, @Param("schoolName") String schoolName,
        @Param("contactName") String contactName, @Param("contactEmail") String contactEmail,
        @Param("webAddress") String webAddress, @Param("sector") Sector sector,
        @Param("yearLevels") String yearLevels, @Param("image") String image);


}
