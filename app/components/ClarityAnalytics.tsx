"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const ClarityAnalytics = () => {
  useEffect(() => {
    const projectId = "uaspdlps8g"; 
    Clarity.init(projectId);
  }, []);

  return null;
};

export default ClarityAnalytics;
