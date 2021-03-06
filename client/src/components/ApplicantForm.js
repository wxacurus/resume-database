import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

export default function ApplicantForm() {
  const { register, handleSubmit } = useForm();

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("pdf", selectedFile);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error:", error);
      });
    data.resumelink = res.location;
    try {
      const response = await fetch("http://localhost:5000/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Applicant Form</h1>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              id="fname"
              placeholder="First Name"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              id="lname"
              placeholder="Last Name"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="prefname">Preferred Name (Optional)</label>
            <input
              type="text"
              name="prefName"
              className="form-control"
              id="prefname"
              placeholder="Preferred Name"
              ref={register}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="inputEmail"
              placeholder="Email"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputphonenumber">Phone Number</label>
            <input
              type="tel"
              name="phonenumber"
              className="form-control"
              id="inputphonenumber"
              placeholder="(123)-456-7890"
              ref={register}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="inputAddress">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            id="inputAddress"
            placeholder="1234 Main St"
            ref={register}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputCity">City</label>
            <input
              type="text"
              name="city"
              className="form-control"
              id="inputCity"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputState">Province</label>
            <select
              id="inputState"
              name="province"
              className="form-control"
              placeholder=""
              ref={register}
              required
            >
              <option value="">Choose...</option>
              <option value="AB">Alberta</option>
              <option value="BC">British Columbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="inputZip">Zip</label>
            <input
              type="text"
              name="zip"
              className="form-control"
              id="inputZip"
              ref={register}
              required
            />
          </div>
        </div>
        <p>Websites (Optional)</p>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="web1">LinkedIn</label>
            <input
              type="url"
              name="web1"
              className="form-control"
              id="web1"
              placeholder=""
              ref={register}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="web2">Github</label>
            <input
              type="url"
              name="web2"
              className="form-control"
              id="web2"
              placeholder=""
              ref={register}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="web3">Portfolio</label>
            <input
              type="url"
              name="web3"
              className="form-control"
              id="web3"
              placeholder=""
              ref={register}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="file">Resume</label>
          <input
            className="form-control"
            type="file"
            id="file"
            name="file"
            onChange={changeHandler}
          />
          {isFilePicked ? (
            <div>
              <p>Size in bytes: {selectedFile.size}</p>
            </div>
          ) : (
            <p>Select a resume to upload</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Fragment>
  );
}
