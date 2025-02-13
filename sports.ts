import axios from "axios";

interface CricketMatch {
  id: string;
  title: string;
  status: string;
  score: string;
  teams: {
    home: string;
    away: string;
  };
  players: {
    name: string;
    role: string;
    stats: Record<string, string>;
  }[];
}

interface FootballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  status: string;
  league: string;
  players: {
    name: string;
    team: string;
    stats: Record<string, string>;
  }[];
}

// Note: Replace these URLs with actual API endpoints when we have the API keys
const CRICKET_API_URL = "https://api.cricapi.com/v1";
const FOOTBALL_API_URL = "https://api.football-data.org/v2";

export class SportsService {
  private static instance: SportsService;
  private cricketMatches: CricketMatch[];
  private footballMatches: FootballMatch[];
  private lastUpdate: Date;

  private constructor() {
    this.cricketMatches = [];
    this.footballMatches = [];
    this.lastUpdate = new Date(0);
    this.initializeData();
  }

  private async initializeData() {
    await this.updateCricketData();
    await this.updateFootballData();

    // Update data every 5 minutes
    setInterval(() => {
      this.updateCricketData();
      this.updateFootballData();
    }, 5 * 60 * 1000);
  }

  static getInstance(): SportsService {
    if (!this.instance) {
      this.instance = new SportsService();
    }
    return this.instance;
  }

  private async updateCricketData() {
    try {
      // Placeholder data until we integrate with actual API
      this.cricketMatches = [{
        id: "1",
        title: "IND vs AUS",
        status: "Live",
        score: "320/4 (45 overs)",
        teams: {
          home: "India",
          away: "Australia"
        },
        players: [
          {
            name: "Virat Kohli",
            role: "Batsman",
            stats: {
              runs: "85*",
              balls: "70",
              fours: "8",
              sixes: "2"
            }
          }
        ]
      }];
    } catch (error) {
      console.error("Error updating cricket data:", error);
    }
  }

  private async updateFootballData() {
    try {
      // Placeholder data until we integrate with actual API
      this.footballMatches = [{
        id: "1",
        homeTeam: "Manchester City",
        awayTeam: "Arsenal",
        score: "2-1",
        status: "75'",
        league: "Premier League",
        players: [
          {
            name: "Erling Haaland",
            team: "Manchester City",
            stats: {
              goals: "2",
              assists: "0",
              shots: "4"
            }
          }
        ]
      }];
    } catch (error) {
      console.error("Error updating football data:", error);
    }
  }

  async getCricketMatches(): Promise<string> {
    try {
      const matches = this.cricketMatches.map(match => 
        `${match.title}: ${match.score} - ${match.status}`
      ).join("\n");
      return matches || "No live cricket matches at the moment.";
    } catch (error) {
      console.error("Error fetching cricket matches:", error);
      throw new Error("Failed to fetch cricket matches");
    }
  }

  async getFootballMatches(): Promise<string> {
    try {
      const matches = this.footballMatches.map(match =>
        `${match.league}: ${match.homeTeam} ${match.score} ${match.awayTeam} (${match.status})`
      ).join("\n");
      return matches || "No live football matches at the moment.";
    } catch (error) {
      console.error("Error fetching football matches:", error);
      throw new Error("Failed to fetch football matches");
    }
  }

  async getPlayerStats(sport: "cricket" | "football", playerName: string): Promise<string> {
    try {
      if (sport === "cricket") {
        const player = this.cricketMatches
          .flatMap(match => match.players)
          .find(p => p.name.toLowerCase().includes(playerName.toLowerCase()));

        if (player) {
          return `${player.name} (${player.role}):\n` +
            Object.entries(player.stats)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n");
        }
      } else {
        const player = this.footballMatches
          .flatMap(match => match.players)
          .find(p => p.name.toLowerCase().includes(playerName.toLowerCase()));

        if (player) {
          return `${player.name} (${player.team}):\n` +
            Object.entries(player.stats)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n");
        }
      }

      return `No stats found for ${playerName}. They might not be playing in any current matches.`;
    } catch (error) {
      console.error("Error fetching player stats:", error);
      throw new Error("Failed to fetch player statistics");
    }
  }
}

export const sportsService = SportsService.getInstance();
