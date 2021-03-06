package io.cristaling.iss.reddrop.services;

import io.cristaling.iss.reddrop.core.DonationVisit;
import io.cristaling.iss.reddrop.core.Donator;
import io.cristaling.iss.reddrop.repositories.DonationVisitRepository;
import io.cristaling.iss.reddrop.repositories.DonatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class DonatorService {

    DonatorRepository donatorRepository;
    DonationVisitRepository donationVisitRepository;

    @Autowired
    public DonatorService(DonatorRepository repository, DonationVisitRepository donationVisitRepository) {
        this.donatorRepository = repository;
        this.donationVisitRepository=donationVisitRepository;
        Donator donator = new Donator();
        donator.setUuid(UUID.randomUUID());
        donator.setCnp("1971211055084");
        donator.setPassword("password");
        donator.setNume("Fodor");
        donator.setVerified(null);
        donator.setPrenume("Ciprian");
        donator.setEmail("squishymaster12@gmail.com");
        donator.setNrTel("0770122227");
        donatorRepository.save(donator);
    }

    public Donator getDonatorById(UUID uuid){
        return donatorRepository.getOne(uuid);
    }

    public Donator getDonatorbyVerified(UUID uuid){
        return donatorRepository.getDonatorByVerified(uuid);
    }

    public UUID tryToLogin(String cnp, String password) {

        if (cnp == null || password == null) {
            return null;
        }

        Donator toLogin = this.donatorRepository.getDonatorByCnp(cnp);

        if (toLogin == null) {
            return null;
        }

        if (password.equals(toLogin.getPassword())) {
            return toLogin.getUuid();
        }

        return null;
    }

    public void registerDonator(Donator donator) {
        donatorRepository.save(donator);
    }

    public Date getNextAvailableDate(UUID uuid){
        List<DonationVisit> donationvisit = donationVisitRepository.getDonationVisitsByDonatorOrderByDate(uuid);
        if(donationvisit.isEmpty()){
            return new Date();
        }
        Date lastVisit=donationvisit.get(donationvisit.size()-1).getDate();
        lastVisit.setTime((long)((long)lastVisit.getTime()+(long)483890*10000));
        Date currentDate=new Date();
        if(currentDate.after(lastVisit)){
            return currentDate;
        }
        return lastVisit;
    }

	public List<Donator> getAllDonators() {
        return donatorRepository.findAll();
	}

	public void deleteDonator(UUID actualUuid) {
        donatorRepository.deleteById(actualUuid);
	}
}
