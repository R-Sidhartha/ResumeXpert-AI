"use server";

import openai from "@/lib/openai";
import {
  GeneratePORInput,
  generatePORSchema,
  GenerateProjectsInput,
  generateProjectsSchema,
  GenerateResumeDataInput,
  generateResumeDataSchema,
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  POR,
  Projects,
  ResumeValues,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { toast } from "sonner";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const {
    jobTitle,
    workExperiences,
    educations,
    skills,
    Projects,
    certifications,
    achievements,
    POR,
  } = generateSummarySchema.parse(input);

  const sections: string[] = [];

  if (workExperiences?.length) {
    const formatted = workExperiences
      .map(
        (exp) =>
          `- ${exp.position} at ${exp.company} (${exp.startDate} to ${exp.endDate || "Present"}): ${exp.description}`,
      )
      .join("\n");
    sections.push(`Work Experience:\n${formatted}`);
  }

  if (educations?.length) {
    const formatted = educations
      .map(
        (edu) =>
          `- ${edu.degree} at ${edu.school} (${edu.startDate} to ${edu.endDate})`,
      )
      .join("\n");
    sections.push(`Education:\n${formatted}`);
  }

  if (skills) {
    sections.push(`Skills:\n${skills}`);
  }

  if (Projects?.length) {
    const formatted = Projects.map(
      (proj) => `- ${proj.title}: ${proj.description}`,
    ).join("\n");
    sections.push(`Projects:\n${formatted}`);
  }

  if (certifications?.length) {
    const formatted = certifications
      .map((cert: string) => `- ${cert}`)
      .join("\n");
    sections.push(`Certifications:\n${formatted}`);
  }

  if (achievements?.length) {
    const formatted = achievements.map((ach) => `- ${ach}`).join("\n");
    sections.push(`Achievements:\n${formatted}`);
  }

  if (POR?.length) {
    const formatted = POR.map(
      (por) =>
        `- ${por.position} at ${por.organization} (${por.startDate} to ${por.endDate || "Present"}): ${por.description}`,
    ).join("\n");
    sections.push(`Positions of Responsibility:\n${formatted}`);
  }

  const systemMessage = `
You are an expert resume assistant AI. Generate a short, professional resume summary for the user based on the information provided.
Guidelines:
- Tailor it for the job title: "${jobTitle}"
- Highlight major strengths and unique achievements
- Include quantified metrics if possible (e.g., improved efficiency by 30%)
- Wrap all impactful or important words that should be highlighted in the       resume using curly braces {}. Only wrap the most relevant words or phrases that make the achievements stand out.
- Write no more than 50 words
- Make it ATS-friendly and recruiter-attractive
Return only the summary.
`;

  const userMessage = `
Here is the user's data:
${sections.join("\n\n")}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  return (
    completion.choices[0].message.content?.trim() || "Summary not generated."
  );
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { description } = generateWorkExperienceSchema.parse(input);

  console.log("inside generateWorkExperience function", description);

  const systemMessage = `
You are a professional resume assistant AI.

Your task is to generate a detailed work experience entry in valid JSON format, based on the user input.

Return ONLY valid JSON. Do not include any explanation or additional text outside the JSON.

The JSON should have the following format:

{
  "job_title": "string",
  "company": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD" | "Present",
  "description": [
    "First bullet point with strong impact",
    "Second bullet point with action verbs and quantified results",
    "Third bullet point...",
    "... up to 4 bullet points"
  ]
}

Guidelines for generating the bullet points in "description":
- Focus on impact, accomplishments, and measurable outcomes.
- Start with action verbs.
- Include relevant tools, technologies, or methodologies where appropriate.
- Wrap all impactful or achievement-focused words or phrases using curly braces {} to highlight them in the resume.
- Use professional tone and ATS-optimized language.
- Make sure the bullets are clear, concise, and impressive to recruiters.
`;

  const userMessage = `
  Please generate a detailed work experience entry from the following context:
  
  "${description}"
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("AI failed to generate work experience.");
  }

  let parsed: any;

  try {
    parsed = JSON.parse(aiResponse);
  } catch (err) {
    console.warn("Failed to parse JSON, falling back to regex", err);
  }

  if (parsed) {
    const {
      job_title: position = "",
      company = "",
      start_date: startDate = "",
      end_date: endDate = "",
      description = [],
    } = parsed;

    return {
      position,
      company,
      startDate,
      endDate,
      description,
    } satisfies WorkExperience;
  }

  //   const position = aiResponse.match(/Job title:\s*(.*)/i)?.[1] || "";
  //   const company = aiResponse.match(/Company:\s*(.*)/i)?.[1] || "";
  //   const startDate = aiResponse.match(/Start date:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
  //   const endDate = aiResponse.match(/End date:\s*(\d{4}-\d{2}-\d{2})/)?.[1];

  //   const rawDescription =
  //     aiResponse.match(/Description:\s*([\s\S]*)/i)?.[1]?.trim() || "";

  //   const descriptionArray = rawDescription
  //     .split(/\n|•|-|\*/g)
  //     .map((line) => line.trim())
  //     .filter((line) => line.length > 0);

  //   return {
  //     position,
  //     company,
  //     startDate,
  //     endDate,
  //     description: descriptionArray,
  //   } satisfies WorkExperience;
}

export async function generateProject(input: GenerateProjectsInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { description } = generateProjectsSchema.parse(input);

  // const subscriptionLevel = await getUserSubscriptionLevel(userId);
  // if (!canUseAITools(subscriptionLevel)) throw new Error("Upgrade your subscription");

  const systemMessage = `
  You are a professional resume-writing AI. Your task is to transform a rough project description into a structured resume project entry.
  
  Return the following format:
  
  Project Title: <project title>
  start_date: YYYY-MM-DD
  end_date: YYYY-MM-DD | Present
  Description: An array of 3-5 strong bullet points for the description.
  
  Guidelines:
  - Use strong action verbs
  - Focus on impact and quantify wherever possible (e.g., "increased speed by 30%")
  - Follow strict format for start_date and end_date which is YYYY-MM-DD
  - For description bullet icons strictly use • and don't include start_date and end_date in description
  - Mention some advanced and important tech stack used and place them at necessary places in description bullet points
  - Use curly braces {} to wrap technical terms, tools, metrics, or impactful outcomes that should be emphasized in the resume.
  - Do NOT return any other text or comments outside this structure.
  `;

  const userMessage = `Project Description: ${description}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) throw new Error("Failed to generate project info");

  const title = aiResponse.match(/Project Title:\s*(.*)/i)?.[1] || "";
  // const techStack = aiResponse.match(/Tech Stack:\s*(.*)/i)?.[1] || "";

  const rawDescription =
    aiResponse.match(/Description:\s*([\s\S]*)/i)?.[1]?.trim() || "";

  const startDate =
    aiResponse.match(/start_date:\s*([^\n]*)/i)?.[1]?.trim() || "";
  const endDate = aiResponse.match(/end_date:\s*([^\n]*)/i)?.[1]?.trim() || "";

  const descriptionArray = rawDescription
    .split(/\n|•|\*/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    title,
    //   techStack,
    startDate,
    endDate,
    description: descriptionArray,
  } satisfies Projects;
}

export async function generatePOR(input: GeneratePORInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { description } = generatePORSchema.parse(input);

  // const subscriptionLevel = await getUserSubscriptionLevel(userId);
  // if (!canUseAITools(subscriptionLevel)) throw new Error("Upgrade your subscription");

  const systemMessage = `
  You are an AI resume assistant that transforms leadership or campus responsibility descriptions into structured entries.
  
  Return in this format:
  
  Position: <position or role>
  Organization: <organization name> (if applicable)
  start_date: YYYY-MM-DD
  end_date: YYYY-MM-DD | Present
  Description: An array of 3-5 strong bullet points for the description
  
  Guidelines:
  - Use active voice and action verbs
  - Include impact, leadership, coordination, or measurable outcomes
  - strictly Use • as bullet icon for description
  - Highlight key leadership actions, roles, or achievements by wrapping them in curly braces {} for resume emphasis.
  - Do not include any irrelevant information
  `;

  const userMessage = `Position of Responsibility: ${description}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) throw new Error("Failed to generate POR entry");

  const position = aiResponse.match(/Title:\s*(.*)/i)?.[1] || "";
  const organization = aiResponse.match(/Organization:\s*(.*)/i)?.[1] || "";

  const rawDescription =
    aiResponse.match(/Description:\s*([\s\S]*)/i)?.[1]?.trim() || "";

  const descriptionArray = rawDescription
    .split(/\n|•|\*/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const startDate =
    aiResponse.match(/start_date:\s*([^\n]*)/i)?.[1]?.trim() || "";
  const endDate = aiResponse.match(/end_date:\s*([^\n]*)/i)?.[1]?.trim() || "";

  return {
    position,
    organization,
    startDate,
    endDate,
    description: descriptionArray,
  } satisfies POR;
}

export async function generateFormattedResume(input: GenerateResumeDataInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { extractedText } = generateResumeDataSchema.parse(input);

  const systemMessage = `
You are an expert resume-parsing and formatting AI. Given a raw resume text, your job is to intelligently and accurately read and structure the extracted data into a strict JSON object with this exact shape (do NOT return markdown or extra commentary):

{
  firstName: string,
  lastName: string,
  phone: string,
  email: string,

  workExperiences: [
    {
      position: string,
      company: string,
      startDate: string, // YYYY-MM-DD
      endDate: string,   // YYYY-MM-DD or Present
      description: string[]
    }
  ],

  Projects: [
    {
      title: string,
      startDate: string,
      endDate: string,
      description: string[]
    }
  ],

  POR: [
    {
      position: string,
      organization: string,
      startDate: string,
      endDate: string,
      description: string[]
    }
  ],

  achievements: string[],
  certifications: string[],
  extraCurriculars: string[],

  educations: [
    {
      degree: string,
      school: string,
      startDate: string,
      endDate: string
    }
  ],

  skills: [
    {
      label: string,     // like "Frontend", "Backend", "Languages"
      skills: string[]   // like ["React", "Node.js"]
    }
  ],

  summary: string,

  customSections: [
    {
      title: string, // Name of the custom/extra section found
      entries: [
        {
          heading: string, // mention if present and applicable or empty
          subheading: string, // mention if present and applicable or empty
          location: string, // mention if present and applicable or empty
          startDate: string, // YYYY-MM-DD or empty
          endDate: string,   // YYYY-MM-DD or Present or empty
          description: string[]
        }
      ]
    }
  ]
}

Strict rules:
- All date fields must be in YYYY-MM-DD format
- All arrays must contain clean bullet-pointed strings(no markdown or symbols)
- Return a VALID JSON object ONLY with type safety. No explanation, no markdown, no commentary.
- Wrap important keywords, impactful actions, tools, metrics, or achievements using curly braces {} to emphasize them in the resume.
- If any section in the extracted text does not match the known ones, include it under \`customSections\` using the structure above.
- Importantly if any fields are hard to read and format, then leave them blank.
`;

  const userMessage = `Extracted Resume Text:\n${extractedText}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiText = completion.choices[0]?.message?.content;
  console.log("aiText", aiText);
  if (!aiText) {
    toast.error("AI returned empty result");
    return null;
  }
  try {
    const parsed = JSON.parse(aiText) as Partial<ResumeValues>;
    return parsed;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    toast.error("AI returned invalid JSON");
    return null;
  }
}
