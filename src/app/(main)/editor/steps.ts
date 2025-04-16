import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import ProjectsForm from "./forms/ProjectsForm";
import PORForm from "./forms/PORForm";
import CertificationForm from "./forms/CertificationForm";
import ExtraCurricularForm from "./forms/ExtraCurricularForm";
import AchievementForm from "./forms/AchievementForm";
import FileUploadForm from "./forms/FileUploaderForm";
import CustomSectionForm from "./forms/CustomSectionsForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General info", component: GeneralInfoForm, key: "general-info" },
  {
    title: "Previous resume upload",
    component: FileUploadForm,
    key: "resume-upload",
  },
  { title: "Personal info", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Work experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Projects",
    component: ProjectsForm,
    key: "projects",
  },
  { title: "Education", component: EducationForm, key: "education" },
  { title: "Achievements", component: AchievementForm, key: "achievements" },
  {
    title: "Certifications",
    component: CertificationForm,
    key: "certifications",
  },
  { title: "Skills", component: SkillsForm, key: "skills" },
  { title: "POR", component: PORForm, key: "position-of-responsibilities" },
  {
    title: "Extra-Curricular",
    component: ExtraCurricularForm,
    key: "extra-curricular",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
  {
    title: "Custom Section",
    component: CustomSectionForm,
    key: "customSection",
  },
];
