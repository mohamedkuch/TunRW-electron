import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamMembers } from '../admin-about/teamMeambers.modal';
import { Subscription } from 'rxjs';
import { TeamMembersService } from '../admin-about/teamMembers.service';


@Component({
    selector: 'app-admin-teams',
    templateUrl: './admin-teams.component.html',
    styleUrls: ['./admin-teams.component.scss']
})
export class AdminTeamsComponent implements OnInit, OnDestroy {
    teamMembers: TeamMembers[] = [];
    private teamMembersSub: Subscription;
    isLoading = false;
    totalTeamMembers = 0;
    postsPerPage = 10;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    constructor(public teamMembersService: TeamMembersService) { }


    ngOnInit() {
        this.isLoading = true;
        this.teamMembersService.getTeamMembers(this.postsPerPage, this.currentPage);
        this.teamMembersSub = this.teamMembersService.getTeamMemberUpdateListener()
            .subscribe(
                (teamMembersData: { teamMembers: TeamMembers[], postCount: number }) => {
                    this.isLoading = false;
                    this.totalTeamMembers = teamMembersData.postCount;
                    this.teamMembers = teamMembersData.teamMembers;
                });
    }

    ngOnDestroy(): void {
        this.teamMembersSub.unsubscribe();
    }


}