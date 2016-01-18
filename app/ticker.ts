class TickTick {
    public seq: number = 0;
    public tstamp: number = null;
    public processTime: number = 0;
}
class TickFrags {
    public hit: number = 0;
    public shoot: number = 0;
    public total: number = 0;
}
export class Tick {
    public tick: TickTick = new TickTick();
    public frags: TickFrags = new TickFrags();
}
