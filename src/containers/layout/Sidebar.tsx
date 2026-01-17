import { useState } from "react";
import { AccountTree, Add, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grow,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { toggleSideBar } from "../../redux/slices/authSlice";
import { useQuery } from "@apollo/client";
import { projects } from "../../graphql/queries";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { data: projectsData } = useQuery(projects, {
    fetchPolicy: "cache-and-network",
  });

  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    null,
  );

  const handleAccordionChange = (active: string | null) => {
    setExpandedAccordion((prev) => (active === prev ? null : active));
  };

  const handleAddNewProject = () => {
    console.log("should navigate");
    navigate("/create-project");
  };

  const handleCloseNavbar = () => {
    dispatch(toggleSideBar(false));
  };

  return (
    <div className="fixed top-0 left-0 h-screen overflow-auto border-r border-r-slate-300 w-[250px]">
      <div className="h-[65px] flex items-center justify-between pl-5 border-b  bg-secondary-color text-primary-color">
        <h2 className="uppercase font-semibold ">tasks</h2>
        <IconButton onClick={handleCloseNavbar} sx={{ mr: 1 }}>
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
      </div>

      <Accordion
        expanded={expandedAccordion === "projects"}
        onChange={() => handleAccordionChange("projects")}
        sx={{ m: "0px !important" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "#fff" }} />}
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            height: "40px !important",
            minHeight: "40px !important",
          }}
        >
          <AccountTree sx={{ marginRight: 1 }} />{" "}
          <p className="capitalize">projects</p>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0, maxHeight: 300, overflow: "auto" }}>
          <div className="p-3">
            {projectsData?.projects?.map((project: any, index: number) => (
              <motion.div whileTap={{ scale: 0.8 }}>
                <Grow
                  in={expandedAccordion === "projects"}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(expandedAccordion === "projects"
                    ? { timeout: 100 * (index - 1) }
                    : {})}
                >
                  <NavLink
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "bg-secondary-color text-primary-color"
                          : "hover:bg-secondary-color/40"
                      } capitalize my-1 block p-1 rounded `
                    }
                    to={`/board/${project?.id}`}
                  >
                    {project?.name}
                  </NavLink>
                </Grow>
              </motion.div>
            ))}
          </div>
          <IconButton
            sx={{
              borderRadius: 0,
              backgroundColor: "#1F2937",
              color: "#fff",
              ":hover": {
                color: "#1F2937",
              },
            }}
            className="w-full h-[30px] "
            onClick={handleAddNewProject}
          >
            <Add />
          </IconButton>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedAccordion === "manage-projects"}
        onChange={() => handleAccordionChange("manage-projects")}
        sx={{ m: "0px !important" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "#fff" }} />}
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            height: "40px !important",
            minHeight: "40px !important",
          }}
        >
          <AccountTree sx={{ marginRight: 1 }} />{" "}
          <p className="capitalize">Invitations</p>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <div className="p-3">
            <motion.div whileTap={{ scale: 0.8 }}>
              <Grow
                in={expandedAccordion === "manage-projects"}
                style={{ transformOrigin: "0 0 0" }}
                {...(expandedAccordion === "manage-projects"
                  ? { timeout: 1000 }
                  : {})}
              >
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "bg-secondary-color text-primary-color"
                        : "hover:bg-secondary-color/40"
                    } capitalize my-1 block p-1 rounded `
                  }
                  to={`/sent-invitations`}
                >
                  sent
                </NavLink>
              </Grow>
            </motion.div>
            <motion.div whileTap={{ scale: 0.8 }}>
              <Grow
                in={expandedAccordion === "manage-projects"}
                style={{ transformOrigin: "0 0 0" }}
                {...(expandedAccordion === "manage-projects"
                  ? { timeout: 1000 }
                  : {})}
              >
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "bg-secondary-color text-primary-color"
                        : "hover:bg-secondary-color/40"
                    } capitalize my-1 block p-1 rounded `
                  }
                  to={`/received-invitations`}
                >
                  received
                </NavLink>
              </Grow>
            </motion.div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Sidebar;
