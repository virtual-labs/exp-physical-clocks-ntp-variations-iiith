### Physical Clocks

A clock is anything that can count time. Wo water clocks, mechanical clocks, electronic clocks and atomic clocks are all different kinds of clock. All modern clocks have something that oscillates - changes between two states in a regular manner. In a pendulum clock, it is the pendulum going to and fro. In a mechanical watch it is the escapement singing from one side to another. In an electronic watch, it is the oscillations of a quartz crystal [(REF)](https://qr.ae/pKjFbd).

A physical clock is a device that indicates what time it is. Examples of physical clocks are a clock on your wall, a watch, a computer time of day clock, a processor cycle counter, the US Naval Observatory, and so forth. A distributed system can have many physical clocks, and in general they will not agree [(REF)](https://qr.ae/pKjFtR).

Distributed systems involve multiple networked systems by definition. This makes it hard to synchronize time on all the systems involved [(REF)](https://qr.ae/pKjFsI).


#### Atomic Clocks

An atomic clock is one in which the oscillation is the resonant frequency of an atom. Some atoms have particularly stable resonant frequencies: rubidium is an example. So instead of counting, say, the swings of a pendulum, an atomic clock counts the oscillations of a rubidium atom [(REF)](https://qr.ae/pKjFbd).

A atomic clock is one that uses transitions of atoms. The second (unit of time) is literally defined in terms of how some atomic clocks work, by counting some number of hyperfine transitions of some specific isotope (of course that number of transitions was based on the astronomical basis of hours/minutes/seconds, but by it made sense to redefine it in terms of how atomic clocks work) [(REF)](https://qr.ae/pKjFsq).

Radio controlled electronic clocks are often marketed as “atomic clocks” but they are not [(REF)](https://qr.ae/pKjFMu).

Inside a quartz clock or watch, the battery sends electricity to the quartz crystal through an electronic circuit. The quartz crystal oscillates (vibrates back and forth) at a precise frequency: exactly 32,768 times each second. The circuit counts the number of vibrations and uses them to generate regular electric pulses, one per second [(REF)](https://qr.ae/pKjFMu).

Inside a cesium atomic clock, cesium atoms are funneled down a tube where they pass through radio waves. If this frequency is just right 9,192,631,770 cycles per second then the cesium atoms "resonate" and change their energy state. A detector at the end of the tube keeps track of the number of cesium atoms reaching it that have changed their energy states. The more finely tuned the radio wave frequency is to 9,192,631,770 cycles per second, the more cesium atoms reach the detector. The circuit counts this frequency. As with a single swing of the pendulum in a simple clock, or 32,768 vibrations in a quartz clock, a second is ticked off when the frequency count is met [(REF)](https://qr.ae/pKjFMu).

A hybrid of this is the radio controlled electronic clock which resets itself daily based on a radio signal received from an atomic clock. The NIST (National Institute of Standards and Technology) radio station WWVB broadcasts on a frequency of 60 kHz. The radio controlled clock actually has a miniature radio receiver inside, which is permanently tuned to receive the 60 kHz signal [(REF)](https://qr.ae/pKjFMu).


#### Digital Clocks

A digital clock, technically refers to the display, not the timekeeping mechanism. Before digital clocks came along, clock time was usually read from a face with hands on it. The digital clock actually shows digits. Digital clocks are usually based on a quartz based timekeeping mechanism. But there have been electric clocks, with a mechanical based digital display. They kept time via the fact AC has a 60hz cycle (in the US) [(REF)](https://qr.ae/pKjFsq).


#### Analog Clocks

Some people use the term analog clock, for a clock with a face and hands. I suppose that could be a confusing use of the word analog. In one sense of the words, analog vs digital means continuous vs discrete. A digital circuit involves devices working with discrete signals, like binary states. Where an analog circuit works with continuously variable signals. Most clocks are quartz, which, independent of how the time is shown, are based on counting the vibrations of a quartz crystal, then dividing down the counter. For example, dividing down a crystal at 32768hz to once a second. How they display the time, is independent of how they measure the time [(REF)](https://qr.ae/pKjFsq).

[![](https://i.imgur.com/Xr0R2UL.jpg)](https://qr.ae/pKjFv3)


#### Managing Time

Start with Network Time Protocol and Precision Time Protocol but be clear about the limit of accuracy & precision you need for your particular application.

Also, beware: Distributed Systems rely on Computer Networks and networks “fail” all the time - they lose packets, the packet latency wanders all over the map depending on traffic, switch queue delay, etc. Internet Protocol (IP) is a “best effort” datagram protocol on purpose - no guarantees. Ethernet is the same. Heck, pretty much all computer clocks wander due to temperature variations, [among other reasons …](https://www.idt.com/products/clocks-timing/application-specific-clocks/spread-spectrum-clocks)

All of those are “faults” by some definition for the purpose of Fault-tolerant Computing, which makes network applications and distributed systems harder to write code for precisely because every operation has to be checked to see if it worked - you can’t assume as so many coders do when they’re coding applications for one computer that “storage will always be there” (it might be a remote filesystem, and what do you do when the SAN is interrupted?), “time always moves monotonically forward” (not when your processor clock rate ramps up & down for power conservation, or even when the system is put to sleep).

And now, just to take you down the rabbit hole, consider the nature of Time and General Relativity in the presence of hyper-accurate clocks like this: [Viewpoint: Optical Atomic Clocks Could Redefine Unit of Time](https://physics.aps.org/articles/v5/126).

Imagine a clock so accurate that moving it (accelerating it) up or down in the gravity well of the Earth by 1cm or 2cm measurably changes its Frame of Reference - that clock exists. Now ponder Time & Frequency Synchronization of two or more of these clocks on different Continents atop the bouncy, bouncy crust of the Earth, which is floating on top of its molten core. Can’t be done, unless you choose to ignore enough of the mantissa (significand) of the clocks you’re comparing because they’re in different frames of reference (and ignoring the difference is declaring the frame of reference “large enough” that the measurable differences don’t matter, but that also limits the precision of time measurement “everywhere” within that frame).

Simultaneity (two or more events happening “at the same time”) or event ordering in time (which is necessary for establishing causality) becomes a very interesting philosophical discussion at that point …

This even shows up in systems we use every day: [GPS and Relativity](http://www.astronomy.ohio-state.edu/~pogge/Ast162/Unit5/gps.html) and [Error analysis for the Global Positioning System](https://en.wikipedia.org/wiki/Error_analysis_for_the_Global_Positioning_System#Relativity) [(REF)](https://qr.ae/pKjFo3).





## Clock Synchronization

You don't have a single source of truth for the time. You only have rough agreement within some epsilon among a collection of local clocks. Maybe you've taken heroic measures to reduce epsilon (e.g. IEEE 1588 on the network, GPS receivers, etc), but it's never 0. So, if you have timestamps from different places in your system, you may not be able to exactly reconstruct the actual order of events for events within epsilon of each other that were stamped by different local clocks [(REF)](https://qr.ae/pKjF5x).

Suppose that you have a global time source. It exists at only a single point in space. Suppose that you want to synchronize with it. You can send it a message, but there is non-trivial latency for your message to get to it and for the reply to get back. Without a very good way of determining this round-trip latency, it is impossible to know when the reference sent you a timestamp [(REF)](https://qr.ae/pKjFAm).


A global clock in a distributed system is a physical and practical impossibility. Computer systems are bounded by the laws of physics and messages can not travel faster than the speed of light. Readings from a “global clock” would necessarily be delayed due to the time taken for the messaging and this is substantial in a distributed system [(REF)](https://qr.ae/pKjF92).

For the same reasons shared memory in a distributed system is a practical and physical impossibility. However, one can in software create an abstraction for “shared memory” in a distributed system and the consequence of clock differences will be inconsistency unless Consensus schemes are used [(REF)](https://qr.ae/pKjF92).

In addition to the use of consensus, it is possible to reduce clock differences to more manageable levels with the use of GPS clocks and Atomic clock. By reducing the potential of clock drift to manageable levels it is possible to process some messages locally during the messaging interval required for global consensus. This is only possible for transformations where results merge without conflicts once global ordering is established [(REF)](https://qr.ae/pKjF92).

The only non-clock-based approach to this, that I know of, is to eschew global consensus for an equally strong proof of consensus known as “gossip about gossip”. Updates are not instantaneous, but consistency is maintained and decentralized without a global clock or even global authority [(REF)](https://qr.ae/pKjF92).

- [Eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency)
- [What is gossip about gossip? | Hedera Hashgraph](https://hedera.com/learning/what-is-gossip-about-gossip)
- [Consensus algorithm](https://en.wikipedia.org/wiki/Consensus_algorithm)
- [GPS disciplined oscillator](https://en.wikipedia.org/wiki/GPS_disciplined_oscillator)
- [Cloud Spanner: TrueTime and external consistency | Google Cloud](https://cloud.google.com/spanner/docs/true-time-external-consistency)
- [Conflict-free replicated data type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)

A global clock just means a common, shared timing source among the participants [(REF)](https://qr.ae/pKjFJ3).

Not having a global clock makes multi-party computation harder. For example, say you have Pa and Pb publishing events to a bunch of subscribers. For a particular application algorithm, things break if subscribers see messages in different order. It wouldn’t do for Pc to see message order Pa then Pb, but Pd see message order Pb then Pa [(REF)](https://qr.ae/pKjFJ3).

If all parties had access to a single, common clock, then message reordering by timestamp fixes the problem (subject to a whole bunch of real-world caveats, e.g., delivery guarantee semantics, compensating for limited resolution, varying jitter bounds, etc.) [(REF)](https://qr.ae/pKjFJ3).


It’s dreadfully inconvenient to compare logs on two systems and find out they don’t come close to agreeing when “now” is. When there are things talking to each other, and time is exchanged, it’s often critical for deciding which time came before the other. That needs syncnronization [(REF)](https://qr.ae/pKjFlL).

It’s really awkward when using a NAS appliance that has times on files that don’t agree with clients. Things that compare file times (like make) get very confused. Editors refuse to save files, because they think the old version is newer than the one you just changed [(REF)](https://qr.ae/pKjFlL).

It’s usually done with NTP, the network time protocol, but there are alternatives. Among them are the use of GPS receivers and rack-mount atomic clocks. But they typically act as an NTP server inside a server complex [(REF)](https://qr.ae/pKjFlL).


What are some common methods for synchronizing clocks in distributed real time systems [(REF)](https://qr.ae/pKjF6L)?
1. Network Time Protocol (NTP): This is the most widely used method for synchronizing clocks in distributed real time systems. NTP uses a hierarchical system of time servers to achieve accurate synchronization of clocks.
2. Precision Time Protocol (PTP): This protocol is designed to achieve much higher accuracy than NTP and is used in applications where extremely precise synchronization is required.
3. Global Positioning System (GPS): This method uses the GPS satellite system to accurately synchronize clocks in distributed real-time systems.
4. Radio Clocks: Radio clocks use radio signals from a radio station to synchronize distributed clocks.
5. Local Area Network (LAN): This method uses a LAN to synchronize clocks in a local area.



#### Additional Resources

- [Distributed Systems 3.2: Clock synchronisation | Martin Kleppmann](https://www.youtube.com/watch?v=mAyW-4LeXZo)
- [Synchronization in Distributed Systems | GeeksforGeeks](https://www.geeksforgeeks.org/synchronization-in-distributed-systems/)
- [A Guide To NTP Clocks and Networked Time Displays | Time Tools Ltd](https://timetoolsltd.com/network-clocks/a-guide-to-ntp-clocks-and-networked-time-displays/)
- [Time Synchronization | Sami Rollins](https://www.cs.usfca.edu/~srollins/courses/cs686-f08/web/notes/timesync.html)
- [Lecture 4: Physical and Logical Time, Causality | CSE 291 Lecture Resources](https://cseweb.ucsd.edu/classes/sp16/cse291-e/applications/ln/lecture4.html)
- [Physical and Logical Clocks | Dilum Bandara](https://www.slideshare.net/DilumBandara/physical-and-logical-clocks)
- [Physical Clock Synchronization: Network Time Protocol (NTP) | Rohini College of Engineering & Technology](https://www.rcet.org.in/uploads/academics/rohini_43877141489.pdf)
- [Time and Clocks | Florida International University](https://users.cs.fiu.edu/~cpoellab/teaching/cse40463/slides2.pdf)
- [Time and Global States | Coulouris, Dollimore, Kindberg and Blair](https://crystal.uta.edu/~elmasri/os2/slides/CDKB/Chapter14.pdf)
- [Logical Time | Ajay Kshemkalyani and Mukesh Singhal](https://www.cs.uic.edu/~ajayk/Chapter3.pdf)
- [Physical Clock Synchronization — Clock Series | Pratik Pandey](https://distributedsystemsmadeeasy.medium.com/physical-clock-synchronization-clock-series-6218638a12b4)
- [Clock Synchronization: Physical Clocks | Paul Krzyzanowski](https://people.cs.rutgers.edu/~pxk/rutgers/notes/content/09-clock-synchronization-slides-6up.pdf)
- [Network Time Protocol (NTP) | GeeksforGeeks](https://www.geeksforgeeks.org/network-time-protocol-ntp/)
- [All Things Clock, Time and Order in Distributed Systems: Physical Time in Depth | Kousik Nath](https://medium.com/geekculture/all-things-clock-time-and-order-in-distributed-systems-physical-time-in-depth-3c0a4389a838)
