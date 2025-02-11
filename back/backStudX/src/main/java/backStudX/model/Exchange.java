package backStudX.model;

import java.time.LocalDate;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exchanges")
public class Exchange {

	@Id
	String id;
	String nativeLanguage;
	String targetLanguage;
	String educationalLevel;
	int academicLevel;
	String idTeacherCreator;
	private Date beginDate;
	private Date endDate;
	int quantityStudents;
	String university;

	public Exchange(String nativeLanguage, String targetLanguage, String educationalLevel, int academicLevel,
			String idTeacherCreator, Date beginDate, Date endDate, int quantityStudents, String university) {
		this.nativeLanguage = nativeLanguage;
		this.targetLanguage = targetLanguage;
		this.educationalLevel = educationalLevel;
		this.academicLevel = academicLevel;
		this.idTeacherCreator = idTeacherCreator;
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.quantityStudents = quantityStudents;
		this.university = university;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNativeLanguage() {
		return nativeLanguage;
	}

	public void setNativeLanguage(String nativeLanguage) {
		this.nativeLanguage = nativeLanguage;
	}

	public String getTargetLanguage() {
		return targetLanguage;
	}

	public void setTargetLanguage(String targetLanguage) {
		this.targetLanguage = targetLanguage;
	}

	public String getEducationalLevel() {
		return educationalLevel;
	}

	public void setEducationalLevel(String educationalLevel) {
		this.educationalLevel = educationalLevel;
	}

	public int getAcademicLevel() {
		return academicLevel;
	}

	public void setAcademicLevel(int academicLevel) {
		this.academicLevel = academicLevel;
	}

	public String getIdTeacherCreator() {
		return idTeacherCreator;
	}

	public void setIdTeacherCreator(String idTeacherCreator) {
		this.idTeacherCreator = idTeacherCreator;
	}

	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public int getQuantityStudents() {
		return quantityStudents;
	}

	public void setQuantityStudents(int quantityStudents) {
		this.quantityStudents = quantityStudents;
	}

	public String getUniversity() {
		return university;
	}

	public void setUniversity(String university) {
		this.university = university;
	}

}
