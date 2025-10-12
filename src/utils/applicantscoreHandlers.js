export const getAllApplicantsScoreData = async ({
  dispatch,
  getAllApplicantsScore,
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
    const result = await Promise.race([dispatch(getAllApplicantsScore()), timeout]);
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
        score: applicant.scores?.length ? applicant.scores[0].score ?? 0 : 0
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

export const handleSearchApplicantsScore = async ({
  query,
  dispatch,
  getApplicantsScore,
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
      const result = await Promise.race([dispatch(getApplicantsScore(query)), timeout]);
      const applicants = result.data;
      const status = result.status;
      console.log(result)

      if (status) {
        const mapped = applicants.map((a) => ({
          id: a.applicants_id,
          applicantno: a.application_no,
          lastname: a.lastname,
          firstname: a.firstname,
          middlename: a.middlename,
          contactno: a.contact_num,
          municipality: a.municipality,
          school: a.school,
          score: a.scores?.length ? a.scores[0].score ?? 0 : 0
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

export const handleUpdateApplicantScore = async ({
  selectedApplicant,
  dispatch,
  updateApplicantsScore,
  fetchApplicant,
  setMessage,
  setSeverity,
  setOpenSnackbar,
  storedUser,
  setSelectedApplicant,
  setFilteredApplicant
}) => {
  if (!selectedApplicant || !selectedApplicant.id || !Number.isInteger(Number(selectedApplicant.score)) ){
      setMessage("Score is not valid or selected applicant is empty.");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
  }

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 120000)
  );

  try {
    const user = JSON.parse(storedUser);
    const userId = user.user_id;
    const result = await Promise.race([
      dispatch(
        updateApplicantsScore(
          selectedApplicant.id,
          selectedApplicant.score,
          userId
        )
      ),
      timeout
    ]);
    console.log(result.status)
    if (result.status === true) {
      setMessage("Score updated successfully.");
      setSeverity("success");
      setOpenSnackbar(true);

      setSelectedApplicant([]);
      setFilteredApplicant([]);
      

      // window.location.reload();
    } else {
      console.log(result)
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

export const handleSearchApplicantsScoreForEncoder = async ({
  query,
  dispatch,
  getApplicantsScore,
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
      const result = await Promise.race([dispatch(getApplicantsScore(query)), timeout]);
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
          school: a.school,
          score: a.scores?.length ? a.scores[0].score ?? 0 : 0
        }));
        setFilteredApplicant(mapped);
        setTransformedApplicant(mapped);
        return
      } else {
        setFilteredApplicant([]);
        setTransformedApplicant([]);
        return
      }
    } catch (error) {
      setMessage("Loading timeout or error, please refresh the page.");
      setSeverity("error");
      setOpenSnackbar(true);
      setFilteredApplicant([]);
      setTransformedApplicant([]);
      setIsLoading(false)
    } finally {
      setIsLoading(false);
    }
  } else {
    setFilteredApplicant([]);
    setTransformedApplicant([]);
    setIsLoading(false);
    return
  }
};