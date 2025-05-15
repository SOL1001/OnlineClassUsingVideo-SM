import React, { useState } from "react";
import ResponseModal from "../../components/ResponseModal";
import {
  Modal,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  PhotoCamera,
  Home,
  Apartment,
  Villa,
  Business,
  Bathtub,
  Hotel,
  KingBed,
  SquareFoot,
  Close,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

interface AddHomeModalProps {
  open: boolean;
  onClose: () => void;
}

const propertyTypes = [
  {
    value: "apartment",
    label: "Apartment",
    icon: <Apartment fontSize="small" />,
  },
  { value: "house", label: "House", icon: <Home fontSize="small" /> },
  { value: "villa", label: "Villa", icon: <Villa fontSize="small" /> },
  { value: "office", label: "Office", icon: <Business fontSize="small" /> },
  { value: "hotel", label: "Hotel", icon: <Hotel fontSize="small" /> },
];

const amenitiesList = [
  "Parking",
  "Swimming Pool",
  "Gym",
  "Security",
  "Garden",
  "Balcony",
  "Furnished",
  "Air Conditioning",
  "WiFi",
  "Pet Friendly",
];
// Remove this duplicate declaration

const steps = ["Basic Information", "Property Details", "Photos & Finalize"];

const AddHomeModal: React.FC<AddHomeModalProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "apartment",
    location: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    description: "",
  });

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const [responseModal, setResponseModal] = useState({
    open: false,
    title: "",
    message: "",
    btnConfirm: false,
    success: false,
    btnLabel2: "",
    btnLabel: "",
    onClose: () => {},
    onConfirm: () => {},
  });

  const handleResponseCloseModal = () => {
    setResponseModal({
      ...responseModal,
      open: false,
      btnConfirm: false,
      title: "",
      message: "",
      success: false,
      btnLabel: "",
    });
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log({
      ...formData,
      amenities: selectedAmenities,
      images,
    });
    setResponseModal({
      ...responseModal,
      open: true,
      btnConfirm: false,
      title: "Published Successfully",
      message: "Published Successfully",
      success: true,
      onClose: () => {
        handleResponseCloseModal();
      },
    });
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title*
              </label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Modern Apartment in Addis"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>

            <div>
              <FormControl fullWidth>
                <InputLabel id="property-type-label">Property Type*</InputLabel>
                <Select
                  labelId="property-type-label"
                  label="Property Type*"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        {type.icon}
                        <span className="ml-2">{type.label}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bole, Addis Ababa"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (ETB)*
                </label>
                <TextField
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50000"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (m²)*
                </label>
                <TextField
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="120"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SquareFoot fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms*
                </label>
                <TextField
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <KingBed fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms*
                </label>
                <TextField
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Bathtub fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built
                </label>
                <input
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  placeholder="2015"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property in detail..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {amenitiesList.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    clickable
                    color={
                      selectedAmenities.includes(amenity)
                        ? "primary"
                        : "default"
                    }
                    onClick={() => handleAmenityChange(amenity)}
                    variant={
                      selectedAmenities.includes(amenity)
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      "&.MuiChip-colorPrimary": {
                        backgroundColor: "#00A16A",
                        color: "white",
                      },
                      "&.MuiChip-outlined": {
                        borderColor: "#00A16A",
                        color: "#00A16A",
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Photos* (Minimum 3)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoCamera className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (MAX. 10MB each)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <Avatar
                        variant="rounded"
                        src={URL.createObjectURL(image)}
                        className="w-full h-24"
                      />
                      <IconButton
                        size="small"
                        className="absolute top-0 right-0 bg-white shadow"
                        onClick={() => handleRemoveImage(index)}
                        sx={{ color: "#00A16A" }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#E8F5EE] p-4 rounded-lg">
              <h3 className="font-medium text-[#006341] mb-2">
                Review Your Listing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Title</p>
                  <p className="font-medium">{formData.title || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Property Type</p>
                  <p className="font-medium">
                    {propertyTypes.find(
                      (t) => t.value === formData.propertyType
                    )?.label || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{formData.location || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">
                    {formData.price ? `ETB ${formData.price}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Area</p>
                  <p className="font-medium">
                    {formData.area ? `${formData.area} m²` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Bedrooms</p>
                  <p className="font-medium">{formData.bedrooms || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            overflowY: "auto",
            py: 4,
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-4 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                List Your Property
              </h2>
              <IconButton onClick={onClose} sx={{ color: "#00A16A" }}>
                <Close />
              </IconButton>
            </div>

            <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "&.Mui-completed": { color: "#00A16A" },
                        "&.Mui-active": { color: "#00A16A" },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className="mb-8">{getStepContent(activeStep)}</div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                className="px-6 py-2"
                sx={{
                  color: "#00A16A",
                  borderColor: "#00A16A",
                  "&:hover": {
                    borderColor: "#008055",
                    backgroundColor: "rgba(0, 161, 106, 0.04)",
                  },
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={images.length < 3}
                  endIcon={<ArrowForward />}
                  className="px-6 py-2 shadow-md"
                  sx={{
                    backgroundColor: "#00A16A",
                    "&:hover": {
                      backgroundColor: "#008055",
                    },
                    "&:disabled": {
                      backgroundColor: "#E0E0E0",
                    },
                  }}
                >
                  Publish Listing
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  className="px-6 py-2 shadow-md"
                  disabled={
                    (activeStep === 0 &&
                      (!formData.title ||
                        !formData.propertyType ||
                        !formData.location)) ||
                    (activeStep === 1 &&
                      (!formData.price ||
                        !formData.area ||
                        !formData.bedrooms ||
                        !formData.bathrooms ||
                        !formData.description))
                  }
                  sx={{
                    backgroundColor: "#00A16A",
                    "&:hover": {
                      backgroundColor: "#008055",
                    },
                    "&:disabled": {
                      backgroundColor: "#E0E0E0",
                    },
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
      <ResponseModal
        onClose={handleResponseCloseModal}
        onConfirm={responseModal.onConfirm}
        open={responseModal.open}
        message={responseModal.message}
        title={responseModal.title}
        btnLabel2={responseModal.btnLabel2}
        btnConfirm={responseModal.btnConfirm}
        btnLabel={responseModal.btnLabel}
        success={responseModal.success}
      />
    </>
  );
};

export default AddHomeModal;
