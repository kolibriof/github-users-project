import React, { useMemo } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = useGlobalContext();
  let mostPopularLanguages = useMemo(() => {
    const languages = repos.reduce((acc, value) => {
      const { language } = value;
      if (!language) {
        return acc;
      }
      if (!acc[language]) {
        acc[language] = { label: language, value: 1 };
      } else {
        acc[language] = { ...acc[language], value: acc[language].value + 1 };
      }
      return acc;
    }, {});
    return languages;
  }, [repos]);
  let mostPopularLanguageByStars = useMemo(() => {
    const languages = repos.reduce((acc, value) => {
      const { language, stargazers_count } = value;
      if (!language || !stargazers_count) {
        return acc;
      }
      if (!acc[language]) {
        acc[language] = { label: language, value: stargazers_count };
      } else {
        acc[language] = {
          ...acc[language],
          value: acc[language].value + stargazers_count,
        };
      }
      return acc;
    }, {});
    return languages;
  }, [repos]);
  let mostForkedRepo = useMemo(() => {
    return repos.reduce((acc, value) => {
      const { forks, name } = value;
      if (!forks || forks === 0) {
        return acc;
      }
      if (!acc[name]) {
        acc[name] = { label: name, value: forks };
      } else {
        acc[name] = { ...acc[name], value: forks };
      }
      return acc;
    }, {});
  }, [repos]);
  let mostWatchedRepos = useMemo(() => {
    return repos.reduce((acc, value) => {
      const { watchers, name } = value;
      if (!watchers || watchers === 0) {
        return acc;
      }
      if (!acc[name]) {
        acc[name] = { label: name, value: watchers };
      } else {
        acc[name] = { ...acc[name], value: watchers };
      }
      return acc;
    }, {});
  }, [repos]);
  mostWatchedRepos = Object.values(mostWatchedRepos)
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
  mostForkedRepo = Object.values(mostForkedRepo)
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
  mostPopularLanguages = Object.values(mostPopularLanguages).sort(
    (a, b) => b.value - a.value
  );
  mostPopularLanguageByStars = Object.values(mostPopularLanguageByStars).sort(
    (a, b) => b.value - a.value
  );
  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostPopularLanguages} />
        <Column3D data={mostWatchedRepos} />
        <Doughnut2D data={mostPopularLanguageByStars} />
        <Bar3D data={mostForkedRepo} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
