import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import a_drugs from "../../../img/icon/a_drugs.png";
import "dayjs/locale/it";
import { RefreshButton } from "../RefreshButton";
import { useContext } from "react";
import { NewVisitContext } from "../../../Model/NewVisitContext";

export default function AcuteDrug(props) {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);

  return (
    <div
      style={
        newVisit.followUp.followUp
          ? style.acuteButtonsFollowup
          : style.acuteButtons
      }
    >
      <div>
        <label style={{ fontSize: 22 }}>
          <img src={a_drugs} width={50} alt="" />
          Medicinale acuto
        </label>
      </div>
      <div>
        <FormControl fullWidth>
          <InputLabel
            id="demo-simple-select-label"
            style={{ maxWidth: "fit-content" }}
          >
            Medicinale acuto
          </InputLabel>
          <Select
            style={{ fontSize: 15 }}
            id="demo-simple-select"
            value={
              props.acuteDrug.drug.name === ""
                ? "Nessuno"
                : newVisit.acuteDrug.drug.name
            }
            onChange={(e) => props.handleAcuteDrug(e)}
            label="Medicinale acuto"
          >
            <MenuItem value="Nessuno">
              <em>Nessuno</em>
            </MenuItem>
            {props.networkError === null && props.drugs !== null ? (
              props.drugs.map((element) => (
                <MenuItem value={element.name}>{element.name}</MenuItem>
              ))
            ) : (
              <MenuItem>
                Errore nell'ottenere la lista farmaci
                <RefreshButton
                  onClick={props.getDrugsFromServer}
                  loading={props.loadingOptions}
                />
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
      <div style={{ display: "flex" }}>
        <input
          disabled
          placeholder={
            props.acuteDrug.unit !== "" ? props.acuteDrug.unit : "Unità"
          }
          style={{ background: `#ffe4e1` }}
        />
        <input
          placeholder="Dose"
          style={{ background: `#ffe4e1` }}
          value={props.acuteDrug.dose}
          name="AcuteDose"
          type="number"
          onChange={props.handleAcuteDrugDose}
          disabled={props.disabledAcute}
        />
      </div>
    </div>
  );
}

const style = {
  acuteButtonsFollowup: {
    background: `#ffe4e1`,
    width: "47vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "4%",
    height: "27vh",
    margin: "1%",
    border: "0.5px solid #b22222",
    boxShadow: "2px 2px 4px #b22222",
  },

  acuteButtons: {
    background: `#ffe4e1`,
    width: "55vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "4%",
    height: "27vh",
    margin: "1%",
    border: "0.5px solid #b22222",
    boxShadow: "2px 2px 4px #b22222",
  },
};