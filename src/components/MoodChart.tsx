
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodData {
  date: string;
  score: number;
}

interface MoodChartProps {
  data: MoodData[];
}

const MoodChart = ({ data }: MoodChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No mood data yet</p>
          <p className="text-sm">Start checking in daily to see your mood trends!</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStrokeColor = (score: number) => {
    if (score > 0.1) return '#10b981'; // green
    if (score < -0.1) return '#ef4444'; // red
    return '#f59e0b'; // yellow
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#64748b"
          />
          <YAxis 
            domain={[-1, 1]}
            tickFormatter={(value) => value.toFixed(1)}
            stroke="#64748b"
          />
          <Tooltip 
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
            formatter={(value: number) => [
              `${value.toFixed(2)}`,
              'Mood Score'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
