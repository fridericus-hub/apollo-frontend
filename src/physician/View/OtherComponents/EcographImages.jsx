import { Checkbox } from "@mui/material";
import { useState, useContext } from "react";
import ChangingJointFieldMediaModal from "../Modals/ChangingJointFieldMediaModal";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { CurrentJointContext } from "../../Model/CurrentJointContext";

const EcographImages = (props) => {
  const { currentJoint } = useContext(CurrentJointContext);
  const [idToChange, setIdToChange] = useState(-1);
  const [showChangingJointFieldModal, setShowChangingJointFieldModal] =
    useState(false);
  const handleSelect = (e, photo) => {
    const index = props.photos.findIndex((p) => p.id === photo.id);
    let newPhotos = [...props.photos];
    if (e.target.checked) {
      newPhotos[index].realJoint = props.joint.joint.jointName;
      newPhotos[index].realSide = props.joint.joint.side;
      newPhotos[index].actualModified = { value: true, select: true };
      if (newPhotos[index].realJoint !== photo.joint) {
        setIdToChange(photo.id);
        setShowChangingJointFieldModal(true);
      }
    } else {
      newPhotos[index].realJoint = undefined;
      newPhotos[index].realSide = undefined;
      newPhotos[index].actualModified = { value: true, select: false };
    }
    props.setPhotos(newPhotos);
  };

  const sortByJoint = (arr) => {
    return arr.sort((a, b) => {
      if (a.joint === currentJoint.name && b.joint !== currentJoint.name) {
        return -1;
      } else if (
        a.joint !== currentJoint.name &&
        b.joint === currentJoint.name
      ) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  return (
    <div className="photo-gallery">
      <div style={style.photoContainer} className="photo-container">
        {sortByJoint(
          props.photos.filter(
            (e) =>
              e.realJoint === undefined ||
              (e.realJoint === currentJoint.name &&
                e.realSide === currentJoint.side)
          )
        ).map((photo, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              margin: 2,
              background: props.photos
                .filter(
                  (e) =>
                    e.realJoint === currentJoint.name &&
                    e.realSide === currentJoint.side
                )
                .includes(photo)
                ? "#90ee90"
                : "",
              borderRadius: "5px",
            }}
          >
            <img
              onLoad={() => {
                props.setLoadingImages(false);
              }}
              onClick={() => props.handleClick(photo.id)}
              src={photo.base64}
              alt={`Photo ${index}`}
              width={"100%"}
              style={{ borderRadius: "5px" }}
            />
            <Checkbox
              checked={props.photos
                .filter(
                  (e) =>
                    e.realJoint === currentJoint.name &&
                    e.realSide === currentJoint.side
                )
                .includes(photo)}
              onChange={(e) => handleSelect(e, photo)}
            ></Checkbox>
          </div>
        ))}
      </div>
      {showChangingJointFieldModal && idToChange !== -1 && (
        <ChangingJointFieldMediaModal
          savedJointName={
            props.photos.filter((p) => p.id === idToChange)[0].joint
          }
          actualJointName={
            props.photos.filter((p) => p.id === idToChange)[0].realJoint
          }
          show={showChangingJointFieldModal}
          setShow={setShowChangingJointFieldModal}
          id={idToChange}
          setJointField={props.setJointField}
          setPhotos={props.setPhotos}
          photos={props.photos}
        />
      )}
    </div>
  );
};

export default EcographImages;

const style = {
  photoContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
  },
};
