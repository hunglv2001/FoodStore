import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import ApexChart from "react-apexcharts";
import {
  apexLineChartDefaultOption,
  apexBarChartDefaultOption,
  apexAreaChartDefaultOption,
} from "constants/ChartConstant";

const titleStyle = {
  position: "absolute",
  zIndex: "1",
};

const extraStyle = {
  position: "absolute",
  zIndex: "1",
  right: "0",
  top: "-2px",
};

const getChartTypeDefaultOption = (type) => {
  switch (type) {
    case "line":
      return apexLineChartDefaultOption;
    case "bar":
      return apexBarChartDefaultOption;
    case "area":
      return apexAreaChartDefaultOption;
    default:
      return apexLineChartDefaultOption;
  }
};

// Helper function to format numbers as Vietnamese currency
const formatCurrencyVND = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const ChartWidget = ({
  title,
  series,
  width,
  height,
  xAxis,
  customOptions,
  card,
  type,
  extra,
}) => {
  let options = getChartTypeDefaultOption(type);
  const isMobile = window.innerWidth < 768;

  const extraRef = useRef(null);
  const chartRef = useRef();

  // Update options to use xAxis categories and format y-axis labels
  options = {
    ...options,
    xaxis: {
      ...options.xaxis,
      categories: xAxis || [],
    },
    yaxis: {
      ...options.yaxis,
      labels: {
        formatter: formatCurrencyVND,
      },
    },
    tooltip: {
      ...options.tooltip,
      y: {
        formatter: formatCurrencyVND,
      },
    },
  };

  // Merge custom options if provided
  if (customOptions) {
    options = { ...options, ...customOptions };
  }

  const renderChart = (
    <div className="chartRef" ref={chartRef}>
      <ApexChart
        options={options}
        type={type}
        series={series}
        width={width}
        height={height}
      />
    </div>
  );

  return (
    <>
      {card ? (
        <Card>
          <div className="position-relative">
            {<div style={!isMobile ? titleStyle : {}}>{title}</div> && (
              <h4
                className="font-weight-bold"
                style={!isMobile ? titleStyle : {}}
              >
                {title}
              </h4>
            )}
            {extra && (
              <div ref={extraRef} style={!isMobile ? extraStyle : {}}>
                {extra}
              </div>
            )}
            {renderChart}
          </div>
        </Card>
      ) : (
        renderChart
      )}
    </>
  );
};

ChartWidget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  series: PropTypes.array.isRequired,
  xAxis: PropTypes.array,
  customOptions: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  card: PropTypes.bool,
  type: PropTypes.string,
};

ChartWidget.defaultProps = {
  series: [],
  height: 300,
  width: "100%",
  card: true,
  type: "line",
};

export default ChartWidget;
