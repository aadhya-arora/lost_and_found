import "../styling/report.css";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { HiOutlineExclamation, HiOutlineCheckCircle } from "react-icons/hi";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLng } from "leaflet";
import Footer from "../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface FormDataType {
  name: string;
  color: string;
  brand: string;
  uniqueId: string;
  dateLost: string;
  timeLost: string;
  image: File | null;
  imagePreview: string | null;
  location: string;
  category: string;
  phone: string;
  email: string;
}

interface FoundDataType {
  name: string;
  color: string;
  brand: string;
  uniqueId: string;
  dateFound: string;
  image: File | null;
  imagePreview: string | null;
  location: string;
  category: string;
  phone: string;
  email: string;
}

interface LocationMarkerProps<T> {
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  formData: T;
}

function LocationMarker<T extends { location: string }>({
  setFormData,
  formData,
}: LocationMarkerProps<T>) {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    async click(e) {
      setPosition(e.latlng);

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`
        );

        
        const address = response.data.address;
        const detailedAddress = [
          address.building,
          address.amenity,
          address.neighbourhood,
          address.suburb,
          address.village,
          address.town,
          address.city,
          address.state,
        ]
          .filter(Boolean)
          .join(", ");

        setFormData({
          ...formData,
          location: detailedAddress || response.data.display_name,
        });
      } catch (error) {
        console.error("Error fetching location name:", error);
        setFormData({
          ...formData,
          location: `${e.latlng.lat}, ${e.latlng.lng}`,
        });
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

const initialLostForm: FormDataType = {
  name: "",
  color: "",
  brand: "",
  uniqueId: "",
  dateLost: "",
  timeLost: "",
  image: null,
  imagePreview: null,
  location: "",
  category: "Accessories",
  phone: "",
  email: "",
};

const initialFoundForm: FoundDataType = {
  name: "",
  color: "",
  brand: "",
  uniqueId: "",
  dateFound: "",
  image: null,
  imagePreview: null,
  location: "",
  category: "Accessories",
  phone: "",
  email: "",
};

const Report: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<"lost" | "found" | null>(
    null
  );

  const [formData, setFormData] = useState<FormDataType>(initialLostForm);
  const [foundData, setFoundData] = useState<FoundDataType>(initialFoundForm);
  const navigate = useNavigate();

  // src/pages/report.tsx

useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      
      // Changed from /user-status to /me
      await axios.get(`${backendUrl}/me`, {
        withCredentials: true,
      });
      // If request succeeds, user is logged in
    } catch (err) {
      alert("You must be logged in to report an item.");
      navigate("/auth");
    }
  };
  checkLoginStatus();
}, [navigate]);

  useEffect(() => {
    const predictCategory = async () => {
      let predictedCategory = await getCategory(formData.name);

      if (/laptop|notebook|macbook|dell|hp|lenovo/i.test(formData.name)) {
        predictedCategory = "Electronics";
      }
      if (/phone|mobile|iphone|samsung|oneplus/i.test(formData.name)) {
        predictedCategory = "Electronics";
      }
      if (/bag|wallet|purse/i.test(formData.name)) {
        predictedCategory = "Accessories";
      }

      setFormData((prev) => ({ ...prev, category: predictedCategory }));
    };

    if (selectedOption === "lost" && formData.name) {
      const timeout = setTimeout(predictCategory, 500);
      return () => clearTimeout(timeout);
    }
  }, [formData.name, selectedOption]);

  useEffect(() => {
    const predictCategory = async () => {
      let predictedCategory = await getCategory(foundData.name);

      if (/laptop|notebook|macbook|dell|hp|lenovo/i.test(foundData.name)) {
        predictedCategory = "Electronics";
      }
      if (/phone|mobile|iphone|samsung|oneplus/i.test(foundData.name)) {
        predictedCategory = "Electronics";
      }
      if (/bag|wallet|purse/i.test(foundData.name)) {
        predictedCategory = "Accessories";
      }

      setFoundData((prev) => ({ ...prev, category: predictedCategory }));
    };

    if (selectedOption === "found" && foundData.name) {
      const timeout = setTimeout(predictCategory, 500);
      return () => clearTimeout(timeout);
    }
  }, [foundData.name, selectedOption]);

  const getCategory = async (itemName: string): Promise<string> => {
    try {
      const res = await axios.post("http://localhost:5001/predict-category", {
        text: itemName,
      });
      return res.data.category;
    } catch (err) {
      console.error("Error predicting category:", err);
      return "Accessories";
    }
  };

  const handleRemoveImageLost = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const handleRemoveImageFound = () => {
    setFoundData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const handleChangeLost = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [id]: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleChangeFound = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      const file = files[0];
      setFoundData((prev) => ({
        ...prev,
        [id]: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setFoundData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

const handleSubmitLost = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    
    let imageUrl = "";
    if (formData.image) {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append("upload_preset", "lost_and_found");
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dopenczbp/image/upload",
        imageData
      );
      imageUrl = cloudinaryResponse.data.secure_url;
    }

    const itemData = { ...formData, imageUrl };

    await axios.post(`${backendUrl}/lost`, itemData, {
      withCredentials: true,
    });

    alert("Lost item report submitted successfully!");

    setFormData(initialLostForm);
    setStep(1);
    setSelectedOption(null);
  } catch (error: any) {
    console.error("Error submitting lost report:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      navigate("/auth");
    } else {
      alert(`Error: ${error.response?.data?.error || "Internal Server Error"}`);
    }
  }
};
 
const handleSubmitFound = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    
    let imageUrl = "";
    if (foundData.image) {
      const imageData = new FormData();
      imageData.append("file", foundData.image);
      imageData.append("upload_preset", "lost_and_found");
      
     
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dopenczbp/image/upload",
        imageData
      );
    
      imageUrl = cloudinaryResponse.data.secure_url;
    }

   
    const itemData = { ...foundData, imageUrl };

    await axios.post(`${backendUrl}/found`, itemData, {
      withCredentials: true,
    });

    alert("Found item report submitted successfully!");
    setFoundData(initialFoundForm);
    setStep(1);
    setSelectedOption(null);
  } catch (error) {
    console.error("Error submitting found report:", error);
  }
};

  return (
    <div>
      <div className="report-hero-section">
        <div className="report-hero-search">
          <FaSearch size={30} color="#4f772d" />
        </div>
        <h1 className="report-header">Where Lost Items Find Their Way Home</h1>
        <p className="report-subline">
          Post your lost or found item and connect with trusted finders
        </p>
        <div className="report-choose">
          <button
            className="report-found"
            onClick={() => {
              setSelectedOption("found");
              setStep(1);
            }}
            type="button"
          >
            <HiOutlineCheckCircle size={30} /> <br />
            Found an item
          </button>
          <button
            className="report-lost"
            onClick={() => {
              setSelectedOption("lost");
              setStep(1);
            }}
            type="button"
          >
            <HiOutlineExclamation size={30} /> <br />
            Lost an item
          </button>
        </div>
      </div>
      {selectedOption === "found" && (
        <div className="found-report">
          <div className="progress-bar">
            <div
              className="progress1"
              style={{ backgroundColor: step >= 1 ? "#4f772d" : "#cbd5c0" }}
            ></div>
            <div
              className="progress2"
              style={{ backgroundColor: step >= 2 ? "#4f772d" : "#cbd5c0" }}
            ></div>
            <div
              className="progress3"
              style={{ backgroundColor: step >= 3 ? "#4f772d" : "#cbd5c0" }}
            ></div>
          </div>
          <div className="report-found-item-section">
            <h1 className="found-report-heading">Report a Found Item</h1>
            <form
              className="found-form"
              onSubmit={handleSubmitFound}
              autoComplete="off"
            >
              {step === 1 && (
                <>
                  <label htmlFor="name" className="label-headings">
                    What did you find?
                  </label>
                  <input
                    className="found-item-name"
                    type="text"
                    id="name"
                    placeholder="Backpack"
                    value={foundData.name}
                    onChange={handleChangeFound}
                    required
                  />
                  <label htmlFor="color" className="label-headings">
                    Color
                  </label>
                  <input
                    className="found-item-name"
                    type="text"
                    id="color"
                    placeholder="Black"
                    value={foundData.color}
                    onChange={handleChangeFound}
                  />
                  <label htmlFor="brand" className="label-headings">
                    Brand(optional)
                  </label>
                  <input
                    className="found-item-name"
                    type="text"
                    id="brand"
                    placeholder="Wildcraft"
                    value={foundData.brand}
                    onChange={handleChangeFound}
                  />
                  <label htmlFor="uniqueId" className="label-headings">
                    Unique Identification (optional)
                  </label>
                  <input
                    className="found-item-name"
                    type="text"
                    id="uniqueId"
                    placeholder="E.g., sticker inside pocket"
                    value={foundData.uniqueId}
                    onChange={handleChangeFound}
                  />
                  <label htmlFor="dateFound" className="label-headings">
                    Date Found
                  </label>
                  <input
                    className="found-item-name"
                    type="date"
                    id="dateFound"
                    value={foundData.dateFound}
                    onChange={handleChangeFound}
                    required
                  />
                  <button
                    type="button"
                    className="submit-report-button"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <label htmlFor="image" className="label-headings">
                    Upload Image
                  </label>
                  {!foundData.imagePreview && (
                    <div className="file-input-wrapper">
                      <button type="button" className="custom-file-button">
                        Browse
                      </button>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleChangeFound}
                        required
                      />
                    </div>
                  )}

                  {foundData.imagePreview && (
                    <div className="image-preview-wrapper">
                      <img
                        src={foundData.imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="remove-image-cross"
                        onClick={handleRemoveImageFound}
                      >
                        ✖
                      </button>
                    </div>
                  )}
                  <label className="label-headings2">
                    Where did you find it?
                  </label>
                  <MapContainer
                    center={[30.516, 76.6597]}
                    zoom={15}
                    style={{
                      height: "300px",
                      width: "100%",
                      marginBottom: "15px",
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                      setFormData={setFoundData}
                      formData={foundData}
                    />
                  </MapContainer>
                  {foundData.location && (
                    <p>
                      <strong>Selected Location:</strong> {foundData.location}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="submit-report-button"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="submit-report-button"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <h3>Suggested Category</h3>
                  <p style={{ marginTop: "-5px" }}>
                    <strong>Category:</strong> {foundData.category}
                  </p>
                  <label htmlFor="phone" className="label-headings">
                    Phone Number
                  </label>
                  <input
                    className="lost-item-name"
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone number"
                    value={foundData.phone}
                    onChange={handleChangeFound}
                    required
                  />
                  <label htmlFor="email" className="label-headings">
                    Email
                  </label>
                  <input
                    className="lost-item-name"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={foundData.email}
                    onChange={handleChangeFound}
                    required
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="submit-report-button"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button type="submit" className="submit-report-button">
                      Report
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {selectedOption === "lost" && (
        <div className="file-report">
          <div className="progress-bar">
            <div
              className="progress1"
              style={{ backgroundColor: step >= 1 ? "#4f772d" : "#cbd5c0" }}
            ></div>
            <div
              className="progress2"
              style={{ backgroundColor: step >= 2 ? "#4f772d" : "#cbd5c0" }}
            ></div>
            <div
              className="progress3"
              style={{ backgroundColor: step >= 3 ? "#4f772d" : "#cbd5c0" }}
            ></div>
          </div>
          <div className="report-lost-item-section">
            <h1 className="lost-report-heading">Report a Lost Item</h1>
            <form
              onSubmit={handleSubmitLost}
              className="lost-form"
              autoComplete="off"
            >
              {step === 1 && (
                <>
                  <label htmlFor="name" className="label-headings">
                    What did you lose?
                  </label>
                  <input
                    className="lost-item-name"
                    type="text"
                    id="name"
                    placeholder="Backpack"
                    value={formData.name}
                    onChange={handleChangeLost}
                    required
                  />
                  <label htmlFor="color" className="label-headings">
                    Color
                  </label>
                  <input
                    className="lost-item-name"
                    type="text"
                    id="color"
                    placeholder="E.g., Black"
                    value={formData.color}
                    onChange={handleChangeLost}
                  />
                  <label htmlFor="brand" className="label-headings">
                    Brand (optional)
                  </label>
                  <input
                    className="lost-item-name"
                    type="text"
                    id="brand"
                    placeholder="E.g., Wildcraft"
                    value={formData.brand}
                    onChange={handleChangeLost}
                  />
                  <label htmlFor="uniqueId" className="label-headings">
                    Unique Identification (optional)
                  </label>
                  <input
                    className="lost-item-name"
                    type="text"
                    id="uniqueId"
                    placeholder="E.g., sticker inside pocket"
                    value={formData.uniqueId}
                    onChange={handleChangeLost}
                  />
                  <label htmlFor="dateLost" className="label-headings">
                    Date Lost
                  </label>
                  <input
                    className="lost-item-name"
                    type="date"
                    id="dateLost"
                    value={formData.dateLost}
                    onChange={handleChangeLost}
                    required
                  />
                  <label htmlFor="timeLost" className="label-headings">
                    Time Lost
                  </label>
                  <input
                    className="lost-item-name"
                    type="time"
                    id="timeLost"
                    value={formData.timeLost}
                    onChange={handleChangeLost}
                    required
                  />
                  <button
                    type="button"
                    className="submit-report-button"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <label htmlFor="image" className="label-headings">
                    Upload Image
                  </label>
                  {!formData.imagePreview && (
                    <div className="file-input-wrapper">
                      <button type="button" className="custom-file-button">
                        Browse
                      </button>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleChangeLost}
                        required
                      />
                    </div>
                  )}

                  {formData.imagePreview && (
                    <div className="image-preview-wrapper">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="remove-image-cross"
                        onClick={handleRemoveImageLost}
                      >
                        ✖
                      </button>
                    </div>
                  )}

                  <label className="label-headings2">
                    Where did you lose it?
                  </label>
                  <MapContainer
                    center={[30.516, 76.6597]}
                    zoom={15}
                    style={{
                      height: "300px",
                      width: "100%",
                      marginBottom: "15px",
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <LocationMarker
                      setFormData={setFormData}
                      formData={formData}
                    />
                  </MapContainer>
                  {formData.location && (
                    <p>
                      <strong>Selected Location:</strong> {formData.location}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="submit-report-button"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="submit-report-button"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3>Category</h3>
                  <p>
                    <strong>Category:</strong> {formData.category}
                  </p>
                  <label htmlFor="phone" className="label-headings">
                    Phone Number
                  </label>
                  <input
                    className="lost-item-name"
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChangeLost}
                    required
                  />
                  <label htmlFor="email" className="label-headings">
                    Email
                  </label>
                  <input
                    className="lost-item-name"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChangeLost}
                    required
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="submit-report-button"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button type="submit" className="submit-report-button">
                      Report
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Report;