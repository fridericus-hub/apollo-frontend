import JointModel from "./JointModel";
import { format, } from 'date-fns';


export default class NewVisitModel {

    patient
    visitDate;
    physicalActivity = {
        'physicalActivity': false,
        'physicalActivityDate': '',
        'physicalActivityType': ''
    };

    traumaticEvent = {
        'traumaticEvent': '',
        'traumaticEventDate': ''
    };
    followUp = {
        'followUp': false,
        'treatmentResponse': '',
        'lastVisit': ''
    };

    joints = [];

    needFollowUp = {
        'needFollowUp': false,
        'followUpDate': '',
    };

    prophylacticDrug = {
        'drug': '',
        'unit': '',
        'dose': '',
        'frequency': ''
    }

    acuteDrug = {
        'drug': '',
        'unit': '',
        'dose': '',
    }

    previousVisit

    isInPresence

    constructor() {

    }

    setPatient(p) {
        this.patient = p
    }

    setVisitDate(d) {
        this.visitDate = d
    }

    setPhysicalActivity(o) {
        this.physicalActivity = {
            physicalActivity: o.physicalActivity,
            physicalActivityDate: o.physicalActivityDate,
            physicalActivityType: o.physicalActivityType
        }
    }

    setTraumaticEvent(t) {
        this.traumaticEvent = {
            traumaticEvent: t.traumaticEvent,
            traumaticEventDate: t.traumaticEventDate
        };
    }

    setIsFollowUp(b) {
        this.followUp = {
            followUp: b,
            treatmentResponse: Number,
            lastVisit: Date
        }
    }

    setJoints(a) {
        this.joints = a
    }

    setFollowUp(t, l) {
        this.followUp = {
            followUp: this.followUp.followUp,
            treatmentResponse: t,
            lastVisit: l
        }
    }

    addJoint(j) {
        this.joints.push(j)
    }

    setNeedFollowUp(nfu) {
        this.needFollowUp = nfu
    }

    setProphylacticDrug(pd) {
        this.prophylacticDrug = pd
    }

    setAcuteDrug(ad) {
        this.acuteDrug = ad
    }

    setCurrentJoint(s) {
        this.currentJoint = s
    }

    clone() {
        return new NewVisitModel()
    }

    getJoint(s) {
        let joint = this.joints.find(e => e.jointName == s)
        if (joint == undefined) {
            joint = new JointModel(s, undefined, undefined, false, false, false, undefined, 'Absent/low', 'Normal', 'Normal', 'Absent', '')
            joint.setName(s)
        }
        return joint
    }

    jointPresence(s) {
        console.log('chiamato jointPresence')
        let b = false
        this.joints.forEach(e => {
            if (e.jointName == s) {
                b = true
            }
        })
        return b
    }

    deleteJoint(s) {
        console.log('elimino', s)
        this.joints = this.joints.filter(joint => joint.jointName != s)
    }

    setPreviousVisit(d) {
        this.previousVisit = d
    }

    setIsInPresence(b) {
        this.isInPresence = b
    }

    toString(f) {
        switch (f) {
            case 'patient':
                return this.patient
            case 'visitDate':
                return format(this.visitDate, 'dd-MM-y')
            case 'physicalActivity':
                if (this.physicalActivity.physicalActivity) {
                    return (
                        this.physicalActivity.physicalActivityDate + '\n' + this.physicalActivity.physicalActivityType
                    )
                } else {
                    return 'nessuna'
                }
            case 'traumaticEvent':
                return (
                    this.traumaticEvent.traumaticEvent + '\n' + this.traumaticEvent.traumaticEventDate
                )
            case 'joints':
                let s = 'Joints visited:\n'
                this.joints.forEach(e => {
                    s += e.jointName + " selected images: "
                    if (e.selectedImages != undefined) {
                        s += e.selectedImages.length + '\n'
                    } else {
                        s += 0
                    }
                })
                return s
        }
    }
}