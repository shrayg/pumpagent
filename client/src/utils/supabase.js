import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ewvqgcnetcqmnlkyjuww.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3dnFnY25ldGNxbW5sa3lqdXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDYyMDYsImV4cCI6MjA2MjQ4MjIwNn0.BQl3L76P5sE_1haOv3Zt7TsgwxSiodNbZXeuJ5GUFBY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
