import "../styling/report.css";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { HiOutlineExclamation, HiOutlineCheckCircle } from "react-icons/hi";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLng } from "leaflet";
import Footer from "../components/footer";

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

interface LocationMarkerProps {
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  formData: FormDataType;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  setFormData,
  formData,
}) => {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setFormData({
        ...formData,
        location: `${e.latlng.lat}, ${e.latlng.lng}`,
      });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const Report: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<"lost" | "found" | null>(
    null
  );

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    color: "",
    brand: "",
    uniqueId: "",
    dateLost: "",
    timeLost: "",
    image: null,
    imagePreview: null,
    location: "",
    category: "Bag",
    phone: "",
    email: "",
  });

  const [foundData, setFoundData] = useState<FoundDataType>({
    name: "",
    color: "",
    brand: "",
    uniqueId: "",
    dateFound: "",
    image: null,
    imagePreview: null,
    location: "",
    category: "",
    phone: "",
    email: "",
  });

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        [id]: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    alert("Lost item report submitted successfully!");
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
            onClick={() => setSelectedOption("found")}
            type="button"
          >
            <HiOutlineCheckCircle size={30} /> <br />
            Found an item
          </button>
          <button
            className="report-lost"
            onClick={() => setSelectedOption("lost")}
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
            <form className="found-form">
              {step === 1 && (
                <>
                  <label htmlFor="name" className="label-headings">
                    What do you find?
                  </label>
                  <input
                    className="found-item-name"
                    type="text"
                    id="name"
                    placeholder="Backpack"
                    value={foundData.name}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                  <label htmlFor="dateFound" className="label-headings">
                    Date Found
                  </label>
                  <input
                    className="found-item-name"
                    type="date"
                    id="dateFound"
                    value={foundData.dateFound}
                    onChange={handleChange}
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
                  <div className="file-input-wrapper">
                    <button type="button" className="custom-file-button">
                      Browse
                    </button>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </div>

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
                        onClick={handleRemoveImage}
                      >
                        {" "}
                        ✖
                      </button>
                    </div>
                  )}
                  <label className="label-headings2">
                    Drop a Pin on the Map
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
                  {foundData.location && (
                    <p>
                      <strong>Selected Location:</strong>
                      {foundData.location}
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
                    value={foundData.phone}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
            <form onSubmit={handleSubmit} className="lost-form">
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />

                  <label htmlFor="dateLost" className="label-headings">
                    Date Lost
                  </label>
                  <input
                    className="lost-item-name"
                    type="date"
                    id="dateLost"
                    value={formData.dateLost}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  <div className="file-input-wrapper">
                    <button type="button" className="custom-file-button">
                      Browse
                    </button>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </div>

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
                        onClick={handleRemoveImage}
                      >
                        ✖
                      </button>
                    </div>
                  )}

                  <label className="label-headings2">
                    Drop a Pin on the Map
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
