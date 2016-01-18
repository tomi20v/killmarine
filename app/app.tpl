<div class="container">
	<div class="row">
		<div class="col-left col-md-3 col-xs-6">
			<ul class="nav nav-tabs nav-justified">
				<li role="presentation"><a href="#">&nbsp;</a></li>
			</ul>
			<marine></marine>
		</div>

		<div class="col-mid mid-tabs col-md-6">
			<ul class="mid-tabs-nav nav nav-tabs nav-justified">
				<li role="presentation">
					<a href="#" class="active">Motd</a>
				</li>
				<li role="presentation">
					<a href="#" class="active">Scoreboard</a>
				</li>
				<li role="presentation">
					<a href="#">Upgrades</a>
				</li>
				<li role="presentation">
					<a href="#">Servers</a>
				</li>
			</ul>
			<div id="mid-tabs-tabs">
				<scoreboard *ngIf="tabsActive == 'scoreboard'"></scoreboard>
			</div>
		</div>
		<div class="col-right col-md-3"></div>
	</div>
</div>
