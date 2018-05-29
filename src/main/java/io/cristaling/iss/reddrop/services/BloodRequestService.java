package io.cristaling.iss.reddrop.services;

import io.cristaling.iss.reddrop.core.BloodRequest;
import io.cristaling.iss.reddrop.core.Doctor;
import io.cristaling.iss.reddrop.repositories.BloodRequestRepository;
import io.cristaling.iss.reddrop.repositories.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BloodRequestService {

    BloodRequestRepository requestRepository;
    DoctorRepository doctorRepository;
    @Autowired
    public BloodRequestService(BloodRequestRepository repository,DoctorRepository doctorRepository) {
        this.requestRepository = repository;
        this.doctorRepository=doctorRepository;
    }

    public void deleteBloodRequest(UUID uuid) {
        requestRepository.deleteById(uuid);
    }

    public void registerBloodRequest(BloodRequest bloodRequest) {
        //TODO Validate Request
        if (bloodRequest.getUuid() == null) {
            bloodRequest.setUuid(UUID.randomUUID());
        }
        if (bloodRequest.getDate() == null) {
            bloodRequest.setDate(new Date());
        }
        requestRepository.save(bloodRequest);
    }

    public List<BloodRequest> getBloodRequestByDoctor(UUID doctorID) {
        return requestRepository.getBloodRequestsByDoctor(doctorID);
    }

}
