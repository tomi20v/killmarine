<ul class="list-group">
	<li class="list-group-item active">This game</li>
	<li class="list-group-item">Frags: {{ gameData.game.frags }}</li>
	<li class="list-group-item">Frags max: {{ gameData.total.top.frags }}</li>
	<li class="list-group-item">Frags total: {{ gameData.total.sum.frags}}</li>
</ul>
<ul class="list-group">
	<li class="list-group-item active">Tops</li>
	<li class="list-group-item">Frags max: {{ gameData.tops.top.frags }}</li>
	<li class="list-group-item">Frags total: {{ gameData.tops.sum.frags}}</li>
</ul>
<button (click)="clickHandler()" class="full">-= CHEaT =-</button>
