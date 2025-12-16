
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentItem, Genre } from '@/lib/types';
import { genres as allGenres } from '@/lib/data';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ViewingStatsChartProps {
    watchedHistory: ContentItem[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-lg border bg-background/80 p-3 shadow-lg backdrop-blur-sm"
      >
        <p className="font-bold text-foreground">{`${payload[0].name}`}</p>
        <p className="text-sm text-muted-foreground">{`Watched: ${payload[0].value}`}</p>
      </motion.div>
    );
  }

  return null;
};

export function ViewingStatsChart({ watchedHistory }: ViewingStatsChartProps) {

  const chartData = useMemo(() => {
    if (!watchedHistory || watchedHistory.length === 0) {
      return [];
    }

    const genreCounts: { [key: string]: number } = {};

    watchedHistory.forEach(item => {
        const itemGenres: { id: number; name: string }[] =
          item.genres?.length
            ? item.genres
            : item.genre_ids
                ?.map(id => allGenres.find(g => g.id === id))
                .filter(Boolean) as Genre[] || [];

        itemGenres.forEach(genre => {
            if (genre?.name) {
                 genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
            }
        });
    });

    return Object.entries(genreCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // top 5 genres

  }, [watchedHistory]);


  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Genre Breakdown</CardTitle>
                 <CardDescription>Your top 5 genres</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
                <p className="text-sm text-muted-foreground text-center">
                    Watch some content to see your stats.
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
    >
        <Card>
          <CardHeader>
            <CardTitle>Genre Breakdown</CardTitle>
            <CardDescription>Your top 5 genres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background focus:outline-none focus:ring-2 focus:ring-ring" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
    </motion.div>
  );
}
