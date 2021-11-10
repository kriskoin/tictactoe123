#include <eosio/eosio.hpp>

using namespace eosio;
CONTRACT tictactoe123 : public contract {
    public:
        using contract::contract;
        TABLE game {
            uint128_t id;
            name challenger;
            name host;
            uint128_t primary_key() const { return id; }
            uint64_t  by_challenger() const { return challenger.value; }
            EOSLIB_SERIALIZE( game, (id)(challenger)(host))
        };

      typedef eosio::multi_index<name("games"), game,
       eosio::indexed_by<name("idxchall"), eosio::const_mem_fun<game, uint64_t, &game::by_challenger>>
      > games_table;

        ACTION welcome(name host , name opponent){
            require_auth(get_self());
            print ("Hola amigos");
        }

        ACTION create( name host, name challenger ){
            
            require_auth(host);
            check(challenger != host,"challenger and host must be diferent");
            games_table games(get_self(),get_self().value);

            //checks for the chagenller
            auto idx_chg = games.get_index<name("idxchall")>();
            auto tmp_chg = idx_chg.lower_bound(challenger.value);
            check(tmp_chg ==idx_chg.end(),"Challenger already exits"); 

            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto record = games.find( tmp_key);
            if( record == games.end() ){
                games.emplace(get_self(), [&]( auto& row ) {
                    row.id = tmp_key;
                    row.challenger = challenger;
                    row.host = host;  
                });
            }else{
                print ("game already exits");
            }
            
        }

       ACTION close( const name host,const name challenger ){
           
            require_auth(host);
            check(challenger != host,"challenger and host must be diferent");
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto record = games.find( tmp_key);
            if( record != games.end() ){
                record = games.erase(record);
            }
            
        }
   
};