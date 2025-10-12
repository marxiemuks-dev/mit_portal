// src/utils/applicantHandlers.js

export const handleDeleteApplicant = async ({
  selectedApplicant,
  setMessage,
  setSeverity,
  setOpenSnackbar,
  dispatch,
  deleteApplicant,
  fetchApplicant,
  setSelectedApplicant,
  setSearchQuery
}) => {
  if (!selectedApplicant || !selectedApplicant.id) {
    setMessage("Select applicant!");
    setSeverity("warning");
    setOpenSnackbar(true);
    return;
  }

  try {
    const result = await dispatch(deleteApplicant(selectedApplicant.id));
    const status = result.status;
    const message = result.message;
    if (status === true) {
      setMessage(message);
      setSeverity("success");
      fetchApplicant();
      setSelectedApplicant(null);
    }
    setSearchQuery("");
    setOpenSnackbar(true);
  } catch (err) {
    console.error("Delete Error:", err.message);
    setMessage("Something went wrong.");
    setSeverity("error");
    setOpenSnackbar(true);
  }
};

export const handleApplicantCardChange = (field, value, setSelectedApplicant) => {
  setSelectedApplicant((prev) => ({
    ...prev,
    [field]: value,
  }));
};

export const closeSnackbar = (setOpenSnackbar) => {
  setOpenSnackbar(false);
};

export const handleSearchApplicants = async ({
  query,
  dispatch,
  searchApplicant,
  setMessage,
  setSeverity,
  setOpenSnackbar,
  setFilteredApplicant,
  setTransformedApplicant,
  fetchApplicant,
  setIsLoading,
  setSelectedApplicant,
  setSearchQuery
}) => {
  setIsLoading(true);
  setSelectedApplicant(null);
  setSearchQuery(query)

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  if (query) {
    try {
      const result = await Promise.race([dispatch(searchApplicant(query)), timeout]);
      const applicants = result.data;
      const status = result.status;

      if (status) {
        const mapped = applicants.map((a) => ({
          id: a.applicants_id,
          applicantno: a.application_no,
          lastname: a.lastname,
          firstname: a.firstname,
          middlename: a.middlename,
          contactno: a.contact_num,
          municipality: a.municipality,
          school: a.school
        }));
        setFilteredApplicant(mapped);
        setTransformedApplicant(mapped);
      } else {
        setFilteredApplicant([]);
        setTransformedApplicant([]);
      }
    } catch (error) {
      setMessage("Loading timeout or error, please refresh the page.");
      setSeverity("error");
      setOpenSnackbar(true);
      setFilteredApplicant([]);
      setTransformedApplicant([]);
    } finally {
      setIsLoading(false);
    }
  } else {
    fetchApplicant();
  }
};

export const searchApplicantsBySchool = async ({
  query,
  dispatch,
  searchApplicantBySchool,
  setMessage,
  setSeverity,
  setOpenSnackbar,
  setFilteredApplicant,
  setTransformedApplicant,
  fetchApplicant,
  setIsLoading,
  setSelectedSchool
}) => {
  setIsLoading(true);

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  if (query === "All") {
    fetchApplicant();
    return;
  }
  setSelectedSchool(query)
  
  try {
    const result = await Promise.race([dispatch(searchApplicantBySchool(query)), timeout]);
    const applicants = result.data;
    const status = result.status;

    if (status) {
      const mapped = applicants.map((a) => ({
        id: a.applicants_id,
        applicantno: a.application_no,
        lastname: a.lastname,
        firstname: a.firstname,
        middlename: a.middlename,
        contactno: a.contact_num,
        municipality: a.municipality,
        school: a.school
      }));
      setFilteredApplicant(mapped);
      setTransformedApplicant(mapped);
    } else {
      setFilteredApplicant([]);
      setTransformedApplicant([]);
    }
  } catch (error) {
    setMessage("Loading timeout or error, please refresh the page.");
    setSeverity("error");
    setOpenSnackbar(true);
    setFilteredApplicant([]);
    setTransformedApplicant([]);
  } finally {
    setIsLoading(false);
  }
};

export const handleFetchAllApplicants = async ({
  dispatch,
  getAllApplicants,
  setMessage,
  setSeverity,
  setOpenSnackbar,
  setFilteredApplicant,
  setTransformedApplicant,
  setIsLoading
}) => {
  setIsLoading(true);

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  try {
    const result = await Promise.race([dispatch(getAllApplicants()), timeout]);
    const applicants = result.data;
    const status = result.status;

    if (status) {
      const mapped = applicants.map((a) => ({
        id: a.applicants_id,
        applicantno: a.application_no,
        lastname: a.lastname,
        firstname: a.firstname,
        middlename: a.middlename,
        contactno: a.contact_num,
        municipality: a.municipality,
        school: a.school
      }));
      setFilteredApplicant(mapped);
      setTransformedApplicant(mapped);
    } else {
      setFilteredApplicant([]);
      setTransformedApplicant([]);
    }
  } catch (error) {
    setMessage("Loading timeout or error, please refresh the page.");
    setSeverity("error");
    setOpenSnackbar(true);
    setFilteredApplicant([]);
    setTransformedApplicant([]);
  } finally {
    setIsLoading(false);
  }
};

export const handleSubmitApplicant = async ({
  e,
  dispatch,
  addApplicant,
  applicationNo,
  firstname,
  middlename,
  lastname,
  contact,
  municipality,
  school,
  setMessage,
  setSeverity,
  setOpenSnackbar,
  fetchApplicant,
  resetForm,
  setOpenDialog,
  setSubmitLoading,
  submitLoadingRef
}) => {
  e.preventDefault();
  setSubmitLoading(true);

  if (!applicationNo || !firstname || !lastname || !municipality || !school) {
    setMessage("Please fill in all required fields.");
    setSeverity("warning");
    setOpenSnackbar(true);
    setSubmitLoading(false);
    return;
  }

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  try {
    const result = await Promise.race([
      dispatch(addApplicant(applicationNo, firstname, middlename, lastname, contact, municipality, school)),
      timeout
    ]);
    if (!submitLoadingRef.current) {
      console.log("Submit loading cancelled — aborting process.");
      return;
    }

    if (result.status === true) {
      setMessage(result.message);
      setSeverity("success");
      setOpenSnackbar(true);
      fetchApplicant();
      resetForm();
      setOpenDialog(false);
    } else {
      setMessage(result.message || "Failed to add applicant.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  } catch (err) {
    const msg =
      err.message === "Request timed out"
        ? "⏱️ Request timed out. Please try again."
        : "⚠️ An unexpected error occurred.";
    setMessage(msg);
    setSeverity("error");
    setOpenSnackbar(true);
  } finally {
    setSubmitLoading(false);
  }
};


export const handleUpdateApplicant = async ({
  selectedApplicant,
  dispatch,
  updateApplicant,
  fetchApplicant,
  setMessage,
  setSeverity,
  setOpenSnackbar
}) => {
  if (!selectedApplicant || !selectedApplicant.id) return;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  try {
    const result = await Promise.race([
      dispatch(
        updateApplicant(
          selectedApplicant.id,
          selectedApplicant.applicantno,
          selectedApplicant.firstname,
          selectedApplicant.middlename,
          selectedApplicant.lastname,
          selectedApplicant.contactno,
          selectedApplicant.municipality,
          selectedApplicant.school
        )
      ),
      timeout
    ]);

    if (result.status === true) {
      setMessage("Applicant updated successfully.");
      setSeverity("success");
      setOpenSnackbar(true);
      fetchApplicant();
    } else {
      setMessage(result.message || "Failed to update.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  } catch (err) {
    const errorMsg =
      err.message === "Request timed out"
        ? "Request timed out. Please try again."
        : "Something went wrong.";
    setMessage(errorMsg);
    setSeverity("error");
    setOpenSnackbar(true);
  }
};
export const fetchApplicantsData = async ({
  dispatch,
  getAllApplicants,
  setFilteredApplicant,
  setTransformedApplicant,
  setIsLoading,
  setMessage,
  setSeverity,
  setOpenSnackbar
}) => {
  setIsLoading(true);

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  try {
    const result = await Promise.race([dispatch(getAllApplicants()), timeout]);
    const applicants = result.data;
    const status = result.status;

    if (status) {
      const mappedApplicants = applicants.map((applicant) => ({
        id: applicant.applicants_id,
        applicantno: applicant.application_no,
        lastname: applicant.lastname,
        firstname: applicant.firstname,
        middlename: applicant.middlename,
        contactno: applicant.contact_num,
        municipality: applicant.municipality,
        school: applicant.school,
      }));
      setFilteredApplicant(mappedApplicants);
      setTransformedApplicant(mappedApplicants);
    } else {
      setFilteredApplicant([]);
      setTransformedApplicant([]);
    }
  } catch (error) {
    setMessage("Loading timeout or error, please refresh the page.");
    setSeverity("error");
    setOpenSnackbar(true);
    setFilteredApplicant([]);
    setTransformedApplicant([]);
  } finally {
    setIsLoading(false);
  }
};
