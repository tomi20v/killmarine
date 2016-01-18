<style>
	.doomguy-container {
		padding-top: 15px;
	}
	.doomguy-container-idle img {
		width: 103%;
	}
	.doomguy-container-dies img {
		width: 158%;
		position: relative;
		left: -24%;
		margin-right: -24%;
	}
	.marine-health-bar {
	}
	.progress-container {
		position: relative;
		width: 90%;
		left: 5%;
		top: -28px;
	}
</style>

<div class="full doomguy-container doomguy-container-{{ state.state | lowercase }}"
	 style="overflow: hidden;">
	<img #imgEl src="app/marine/asset/state-{{ state.state | lowercase }}.gif"
		 (click)="clickHandler()"
		 [style.top]="getMarineTop(imgEl.offsetWidth)"
	/>
	<div class="progress-container" *ngIf="showHealthBar()">
		<div class="progress marine-health-bar full">
			<div role="progressbar"
				 class="progress-bar progress-bar-danger progress-bar-striped"
				 [style.width]="data.health + '%'">
				Marine lvl {{ data.level }}
			</div>
		</div>
	</div>
</div>
<div>health: {{data.health}}</div>
<div>state: {{state.state}}</div>
<button (click)="clickHandler()" class="full">-= MARINE HERE!!1 =-</button>
<br/>
Frags total: {{ gameData.tops.sum.frags }}
<br/><br/>
