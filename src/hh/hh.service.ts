import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { API_URL, CLUSTER_FIND_ERROR, SALARY_CLUSTER_ID } from "./hh.constants";
import { HhResponse } from "./hh.models";
import { firstValueFrom } from "rxjs";
import { HhData } from "@/top-page/top-page.model";

@Injectable()
export class HhService {
  private token: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.token = configService.get("HH_TOKEN") ?? "";
  }

  async getData(text: string): Promise<HhData | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<HhResponse>(API_URL.vacancies, {
          params: {
            text,
            cluster: true,
          },
          headers: {
            "User-Agent": "OwlTop/1.0 (antonlarichev@gmail.com)",
            Authorization: `Bearer ${this.token}`,
          },
        })
      );
      return this.parseData(data);
    } catch (e) {
      if (e instanceof Error) {
        Logger.error(e);
      }
      return null;
    }
  }

  private parseData(data: HhResponse): HhData {
    const salaryCluster = data.clusters.find(c => c.id == SALARY_CLUSTER_ID);
    if (!salaryCluster) {
      throw new Error(CLUSTER_FIND_ERROR);
    }
    const juniorSalary = this.getSalaryFromString(salaryCluster.items[1].name);
    const middleSalary = this.getSalaryFromString(
      salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name
    );
    const seniorSalary = this.getSalaryFromString(
      salaryCluster.items[salaryCluster.items.length - 1].name
    );

    return {
      count: data.found,
      juniorSalary,
      middleSalary,
      seniorSalary,
      updatedAt: new Date(),
    };
  }

  private getSalaryFromString(s: string): number {
    const numberRegExp = /(\d+)/g;
    const res = s.match(numberRegExp);
    if (!res) {
      return 0;
    }
    return Number(res[0]);
  }
}
