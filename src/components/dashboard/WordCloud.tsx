"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const WordCloud = ({ formattedTopics }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (formattedTopics && ref.current) {
      const layout = cloud()
        .size([540, 550]) // width and height
        .words(formattedTopics.map(d => ({ text: d.text, size: fontSizeMapper(d) })))
        .padding(10)
        .rotate(0)
        .font("Times")
        .on("end", draw);

      layout.start();

      function draw(words: cloud.Word[]) {
        const svg = d3.select(ref.current);

        // Clear previous render to prevent words from overlapping
        svg.selectAll("*").remove();

        svg
          .append("g")
          // Center the word cloud
          .attr("transform", `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`)
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", d => `${d.size}px`)
          .style("font-family", "Times")
          .style("fill", theme.theme === "dark" ? "white" : "black")
          .style("cursor", "pointer")
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text(d => d.text!)
          .on("click", (event, d) => {
            router.push("/quiz?topic=" + d.text);
          });
      }
    }
  }, [formattedTopics, theme.theme, router]);

  // Render the SVG container that D3 will manipulate
  return <svg ref={ref} width="100%" height={550} />;
};

export default WordCloud;