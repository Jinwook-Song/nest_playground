import { Injectable } from '@nestjs/common';
import { tool } from 'ai';
import z from 'zod';

@Injectable()
export class ToolsService {
  getWeatherTool() {
    return tool({
      description: 'Get the weather in a city',
      inputSchema: z.object({
        location: z.string().describe('The city name'),
      }),
      execute: async ({ location }) => {
        const temps = [77, 80, 72, 65, 70];
        const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'foggy'];
        const randomTemp = temps[Math.floor(Math.random() * temps.length)];
        const randomCondition =
          conditions[Math.floor(Math.random() * conditions.length)];
        return {
          location,
          temperature: randomTemp,
          condition: randomCondition,
          humidity: Math.floor(Math.random() * 40) + 40,
        };
      },
    });
  }

  getAllTools() {
    return {
      getWeather: this.getWeatherTool(),
    };
  }
}
